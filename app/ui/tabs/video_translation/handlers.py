from pathlib import Path
import flet as ft
from ....services.video_service import VideoService
from .components import VideoComponents

class VideoTranslationHandler:
    def __init__(
        self,
        page: ft.Page,
        video_service: VideoService,
        components: VideoComponents
    ):
        self.page = page
        self.video_service = video_service
        self.components = components
    
    def on_file_selected(self, path: str) -> None:
        """Handle file selection"""
        self.components.controls.start_button.disabled = False
        self.page.update()
    
    async def start_translation(self, e):
        """Handle translation start"""
        if not self.components.file_drop.selected_file:
            return
        
        self.components.controls.start_button.disabled = True
        self.components.controls.cancel_button.disabled = False
        self.page.update()
        
        result = await self.video_service.translate_and_dub(
            Path(self.components.file_drop.selected_file),
            self.components.language_selector.target_lang.value,
            self._update_progress
        )
        
        if result:
            self.components.progress.update_progress(
                1.0,
                f"Translation complete! Saved to: {result}"
            )
        else:
            self.components.progress.update_progress(0, "Translation failed!")
        
        self.components.controls.start_button.disabled = False
        self.components.controls.cancel_button.disabled = True
        self.page.update()
    
    def _update_progress(self, value: float, status: str):
        """Update progress indicator"""
        self.components.progress.update_progress(value, status)
        self.page.update()