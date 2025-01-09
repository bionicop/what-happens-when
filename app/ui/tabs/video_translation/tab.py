import flet as ft
from ....services.video_service import VideoService
from ....services.translation_service import TranslationService
from .components import create_video_components
from .handlers import VideoTranslationHandler

def create_video_translation_tab(page: ft.Page) -> ft.Tab:
    """Create the video translation tab"""
    # Initialize services
    video_service = VideoService()
    translation_service = TranslationService()
    
    # Create components
    components = create_video_components()
    
    # Initialize handler
    handler = VideoTranslationHandler(
        page=page,
        video_service=video_service,
        components=components
    )
    
    # Connect events
    components.controls.start_button.on_click = handler.start_translation
    components.file_drop.on_file_selected = handler.on_file_selected
    
    # Add FilePicker to page
    page.overlay.append(components.file_drop.pick_files_dialog)
    
    # Create layout
    content = ft.Column([
        ft.Container(content=components.language_selector, padding=10),
        ft.Container(content=components.file_drop, padding=10),
        ft.Container(content=components.progress, padding=10),
        ft.Container(content=components.controls, padding=10)
    ], expand=True)
    
    return ft.Tab(
        text="Video Translation",
        icon=ft.icons.VIDEO_LIBRARY,
        content=content
    )