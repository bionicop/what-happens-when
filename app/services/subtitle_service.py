import asyncio
from pathlib import Path
from typing import List, Tuple
import edge_tts
from pydub import AudioSegment

class SubtitleService:
    def __init__(self):
        self.voices = self._load_voices()
    
    def _load_voices(self) -> List[str]:
        try:
            return edge_tts.list_voices()
        except Exception:
            return ["en-US-JennyNeural"]
    
    async def convert_to_speech(
        self,
        text: str,
        voice: str,
        output_path: Path
    ) -> bool:
        try:
            communicate = edge_tts.Communicate(text, voice)
            await communicate.save(str(output_path))
            return True
        except Exception as e:
            print(f"Error converting text to speech: {e}")
            return False
    
    def combine_audio(
        self,
        audio_files: List[Path],
        timings: List[Tuple[float, float]],
        output_path: Path
    ):
        combined = AudioSegment.empty()
        for audio_file, (start, end) in zip(audio_files, timings):
            segment = AudioSegment.from_file(str(audio_file))
            duration = (end - start) * 1000
            if len(segment) > duration:
                segment = segment[:duration]
            combined += segment
        
        combined.export(str(output_path), format="mp3")