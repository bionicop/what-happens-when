from pathlib import Path
from typing import List
import whisper_timestamped
import moviepy.editor as mp

class AudioProcessor:
    def __init__(self):
        self.model = whisper_timestamped.load_model("base")
    
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