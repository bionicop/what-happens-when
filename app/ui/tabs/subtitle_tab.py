import flet as ft
from ...services.subtitle_service import SubtitleService
from ...services.translation_service import TranslationService
from ..components import (
    FileDropZone,
    ProgressIndicator,
    TranslationControls,
    LanguageSelector
)

def create_subtitle_tab(page: ft.Page) -> ft.Tab:
    """Create the subtitle translation tab"""
    subtitle_service = SubtitleService()
    translation_service = TranslationService()
    
    # Components
    file_drop = FileDropZone(
        text="Drop subtitle files here or click to select",
        allowed_extensions=[".srt"]
    )
    language_selector = LanguageSelector()
    progress = ProgressIndicator()
    controls = TranslationControls()
    
    # Layout
    content = ft.Column([
        ft.Container(
            content=language_selector,
            padding=10
        ),
        ft.Container(
            content=file_drop,
            padding=10
        ),
        ft.Container(
            content=progress,
            padding=10
        ),
        ft.Container(
            content=controls,
            padding=10
        )
    ], expand=True)
    
    return ft.Tab(
        text="Subtitle Translation",
        icon=ft.icons.SUBTITLES,
        content=content
    )