from dataclasses import dataclass
import flet as ft
from ...components import (
    FileDropZone,
    LanguageSelector,
    ProgressIndicator,
    TranslationControls
)

@dataclass
class VideoComponents:
    file_drop: FileDropZone
    language_selector: LanguageSelector
    progress: ProgressIndicator
    controls: TranslationControls

def create_video_components() -> VideoComponents:
    """Create and initialize all components for video translation"""
    return VideoComponents(
        file_drop=FileDropZone(
            text="Drop video file here or click to select",
            allowed_extensions=[".mp4", ".avi", ".mkv", ".mov"]
        ),
        language_selector=LanguageSelector(),
        progress=ProgressIndicator(),
        controls=TranslationControls()
    )