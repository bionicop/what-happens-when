from googletrans import Translator
from typing import Optional

class TranslationService:
    def __init__(self):
        self.translator = Translator()
    
    def translate(self, text: str, dest_lang: str) -> Optional[str]:
        try:
            result = self.translator.translate(text, dest=dest_lang)
            return result.text
        except Exception as e:
            print(f"Translation error: {e}")
            return None