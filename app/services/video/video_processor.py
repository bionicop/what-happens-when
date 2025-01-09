from dataclasses import dataclass
from pathlib import Path
from typing import List, Optional
import moviepy.editor as mp
from ..translation_service import TranslationService
from ..subtitle_service import SubtitleService

@dataclass
class AudioResult:
    audio_path: Path
    temp_files: List[Path]

@dataclass
class TranslatedSegment:
    text: str
    start: float
    end: float

class VideoProcessor:
    def process_segments(
        self,
        segments: List[dict],
        target_lang: str,
        translation_service: TranslationService
    ) -> List[TranslatedSegment]:
        """Process and translate segments"""
        translated_segments = []
        for segment in segments:
            translated_text = translation_service.translate(
                segment['text'],
                target_lang
            )
            if translated_text:
                translated_segments.append(TranslatedSegment(
                    text=translated_text,
                    start=segment['start'],
                    end=segment['end']
                ))
        return translated_segments
    
    async def generate_audio(
        self,
        segments: List[TranslatedSegment],
        video_path: Path,
        subtitle_service: SubtitleService
    ) -> Optional[AudioResult]:
        """Generate dubbed audio from segments"""
        try:
            audio_files = []
            timings = []
            
            for i, segment in enumerate(segments):
                audio_path = Path(f"temp_audio_{i}.mp3")
                await subtitle_service.convert_to_speech(
                    segment.text,
                    subtitle_service.voices[0],
                    audio_path
                )
                audio_files.append(audio_path)
                timings.append((segment.start, segment.end))
            
            output_audio = video_path.with_name(f"{video_path.stem}_dubbed.mp3")
            subtitle_service.combine_audio(audio_files, timings, output_audio)
            
            return AudioResult(
                audio_path=output_audio,
                temp_files=audio_files
            )
        
        except Exception as e:
            print(f"Error generating audio: {e}")
            return None
    
    def create_final_video(
        self,
        video_path: Path,
        audio_path: Path
    ) -> Path:
        """Create final video with dubbed audio"""
        output_path = video_path.with_name(f"{video_path.stem}_translated.mp4")
        video = mp.VideoFileClip(str(video_path))
        dubbed_audio = mp.AudioFileClip(str(audio_path))
        final_video = video.set_audio(dubbed_audio)
        final_video.write_videofile(str(output_path))
        return output_path
    
    def cleanup_files(self, audio_path: Path, temp_files: List[Path]):
        """Clean up temporary files"""
        for file in temp_files:
            file.unlink(missing_ok=True)
        audio_path.unlink(missing_ok=True)