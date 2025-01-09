import flet as ft
from typing import Dict, List

class LanguageSelector(ft.UserControl):
    def __init__(self):
        super().__init__()
        self.languages: Dict[str, str] = {
            "en": "English",
            "es": "Spanish",
            "fr": "French",
            "de": "German",
            "hi": "Hindi",
            "ja": "Japanese",
            "ko": "Korean",
            "zh": "Chinese"
        }
    
    def build(self):
        self.source_lang = ft.Dropdown(
            label="Source Language",
            options=[
                ft.dropdown.Option(key=k, text=v)
                for k, v in self.languages.items()
            ],
            value="en",
            width=200
        )
        
        self.target_lang = ft.Dropdown(
            label="Target Language",
            options=[
                ft.dropdown.Option(key=k, text=v)
                for k, v in self.languages.items()
            ],
            value="es",
            width=200
        )
        
        return ft.Container(
            content=ft.Row([
                self.source_lang,
                ft.Icon(ft.icons.ARROW_FORWARD),
                self.target_lang
            ], alignment=ft.MainAxisAlignment.CENTER),
            padding=20
        )