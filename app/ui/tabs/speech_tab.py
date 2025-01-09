import flet as ft
from pathlib import Path
from ...services.video_service import VideoService
from ...services.translation_service import TranslationService
from ..components import (
    FileDropZone,
    LanguageSelector,
    ProgressIndicator,
    TranslationControls
)

def create_speech_tab(page: ft.Page) -> ft.Tab:
    """Create the video translation tab"""
    video_service = VideoService()
    translation_service = TranslationService()
    
    # Components
    file_drop = FileDropZone(
        text="Drop video file here or click to select",
        allowed_extensions=[".mp4", ".avi", ".mkv", ".mov"],
        on_file_selected=lambda path: controls.start_button.disabled = False
    )
    language_selector = LanguageSelector()
    progress = ProgressIndicator()
    controls = TranslationControls()
    
    async def start_translation(e):
        if not file_drop.selected_file:
            return
        
        controls.start_button.disabled = True
        controls.cancel_button.disabled = False
        page.update()
        
        def update_progress(value: float, status: str):
            progress.update_progress(value, status)
            page.update()
        
        result = await video_service.translate_and_dub(
            Path(file_drop.selected_file),
            language_selector.target_lang.value,
            update_progress
        )
        
        if result:
            progress.update_progress(1.0, f"Translation complete! Saved to: {result}")
        else:
            progress.update_progress(0, "Translation failed!")
        
        controls.start_button.disabled = False
        controls.cancel_button.disabled = True
        page.update()
    
    # Connect events
    controls.start_button.on_click = start_translation
    
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
    
    # Add FilePicker to page
    page.overlay.append(file_drop.pick_files_dialog)
    
    return ft.Tab(
        text="Video Translation",
        icon=ft.icons.VIDEO_LIBRARY,
        content=content
    )