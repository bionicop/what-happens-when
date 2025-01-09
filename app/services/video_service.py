import os
from pathlib import Path
from typing import List, Tuple, Optional
import whisper_timestamped
import moviepy.editor as mp
from .translation_service import TranslationService
from .subtitle_service import SubtitleService

class VideoService:
    def __init__(self):
        self.model = whisper_timestamped.load_model("base")
        self.translation_service = TranslationService()
        self.subtitle_service = SubtitleService()
        
    def extract_audio(self, video_path: Path) -> Path:
        """Extract audio from video file"""
        audio_path = video_path.with_suffix('.wav')
        video = mp.VideoFileClip(str(video_path))
        video.audio.write_audiofile(str(audio_path))
        return audio_path
    
    def transcribe_audio(self, audio_path: Path) -> List[dict]:
        """Transcribe audio file with timestamps"""
        result = self.model.transcribe(str(audio_path))
        return result.get('segments', [])
    
    async def translate_and_dub(
        self,
        video_path: Path,
        target_lang: str,
        progress_callback=None
    ) -> Optional[Path]:
        try:
            # Extract audio
            if progress_callback:
                progress_callback(0.1, "Extracting audio...")
            audio_path = self.extract_audio(video_path)
            
            # Transcribe audio
            if progress_callback:
                progress_callback(0.3, "Transcribing audio...")
            segments = self.transcribe_audio(audio_path)
            
            # Translate segments
            if progress_callback:
                progress_callback(0.5, "Translating segments...")
            translated_segments = []
            for segment in segments:
                translated_text = self.translation_service.translate(
                    segment['text'],
                    target_lang
                )
                if translated_text:
                    translated_segments.append({
                        'text': translated_text,
                        'start': segment['start'],
                        'end': segment['end']
                    })
            
            # Generate dubbed audio
            if progress_callback:
                progress_callback(0.7, "Generating dubbed audio...")
            
            audio_files = []
            timings = []
            
            for i, segment in enumerate(translated_segments):
                audio_path = Path(f"temp_audio_{i}.mp3")
                await self.subtitle_service.convert_to_speech(
                    segment['text'],
                    self.subtitle_service.voices[0],
                    audio_path
                )
                audio_files.append(audio_path)
                timings.append((segment['start'], segment['end']))
            
            # Combine audio segments
            if progress_callback:
                progress_callback(0.8, "Combining audio segments...")
            
            output_audio = video_path.with_name(f"{video_path.stem}_dubbed.mp3")
            self.subtitle_service.combine_audio(audio_files, timings, output_audio)
            
            # Merge with video
            if progress_callback:
                progress_callback(0.9, "Merging audio with video...")
            
            output_path = video_path.with_name(f"{video_path.stem}_translated.mp4")
            video = mp.VideoFileClip(str(video_path))
            dubbed_audio = mp.AudioFileClip(str(output_audio))
            final_video = video.set_audio(dubbed_audio)
            final_video.write_videofile(str(output_path))
            
            # Cleanup
            for file in audio_files:
                file.unlink(missing_ok=True)
            audio_path.unlink(missing_ok=True)
            output_audio.unlink(missing_ok=True)
            
            if progress_callback:
                progress_callback(1.0, "Translation complete!")
            
            return output_path
            
        except Exception as e:
            print(f"Error in video translation: {e}")
            return None