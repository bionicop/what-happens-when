import speech_recognition as sr
from typing import Optional
import wave
import pyaudio

class SpeechService:
    def __init__(self):
        self.recognizer = sr.Recognizer()
        self.audio = pyaudio.PyAudio()
        self.stream = None
        self.frames = []
    
    def start_recording(self, sample_rate: int = 16000):
        self.frames = []
        self.stream = self.audio.open(
            format=pyaudio.paInt16,
            channels=1,
            rate=sample_rate,
            input=True,
            frames_per_buffer=1024,
            stream_callback=self._audio_callback
        )
        self.stream.start_stream()
    
    def _audio_callback(self, in_data, frame_count, time_info, status):
        self.frames.append(in_data)
        return (in_data, pyaudio.paContinue)
    
    def stop_recording(self) -> Optional[str]:
        if self.stream:
            self.stream.stop_stream()
            self.stream.close()
            self.stream = None
            
            # Save to WAV file
            with wave.open("temp.wav", 'wb') as wf:
                wf.setnchannels(1)
                wf.setsampwidth(self.audio.get_sample_size(pyaudio.paInt16))
                wf.setframerate(16000)
                wf.writeframes(b''.join(self.frames))
            
            # Recognize speech
            try:
                with sr.AudioFile("temp.wav") as source:
                    audio = self.recognizer.record(source)
                return self.recognizer.recognize_google(audio)
            except Exception as e:
                print(f"Error recognizing speech: {e}")
                return None