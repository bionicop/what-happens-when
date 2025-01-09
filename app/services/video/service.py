from pathlib import Path
from typing import Optional, Callable
from .audio_processor import AudioProcessor
from .video_processor import VideoProcessor
from ..translation_service import TranslationService
from ..subtitle_service import SubtitleService

class VideoService:
    def __init__(self):
        self.audio_processor = AudioProcessor()
        self.video_processor = VideoProcessor()
        self.translation_service = TranslationService()
        self.subtitle_service = SubtitleService()
    
    async def translate_and_dub(
        self,
        video_path: Path,
        target_lang: str,
        progress_callback: Optional[Callable[[float, str], None]] = None
    ) -> Optional[Path]:
        try:
            # Extract and process audio
            if progress_callback:
                progress_callback(0.1, "Extracting audio...")
            audio_path = self.audio_processor.extract_audio(video_path)
            
            # Transcribe audio
            if progress_callback:
                progress_callback(0.3, "Transcribing audio...")
            segments = self.audio_processor.transcribe_audio(audio_path)
            
            # Process segments
            if progress_callback:
                progress_callback(0.5, "Processing segments...")
            translated_segments = self.video_processor.process_segments(
                segments,
                target_lang,
                self.translation_service
            )
            
            # Generate audio
            if progress_callback:
                progress_callback(0.7, "Generating audio...")
            audio_result = await self.video_processor.generate_audio(
                translated_segments,
                video_path,
                self.subtitle_service
            )
            
            if not audio_result:
                return None
            
            # Create final video
            if progress_callback:
                progress_callback(0.9, "Creating final video...")
            output_path = self.video_processor.create_final_video(
                video_path,
                audio_result.audio_path
            )
            
            # Cleanup
            self.video_processor.cleanup_files(
                audio_path,
                audio_result.temp_files
            )
            
            if progress_callback:
                progress_callback(1.0, "Translation complete!")
            
            return output_path
            
        except Exception as e:
            print(f"Error in video translation: {e}")
            return None