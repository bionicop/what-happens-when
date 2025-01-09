import flet as ft
from ..utils.config import load_config
from .tabs import create_subtitle_tab, create_speech_tab
from .components import create_header, create_footer

def create_app(page: ft.Page):
    """Create and configure the main application"""
    # Load configuration
    config = load_config()
    
    # Configure page
    page.title = "Speech Translation App"
    page.theme_mode = ft.ThemeMode.SYSTEM
    page.padding = 20
    page.window_width = 1200
    page.window_height = 800
    page.window_min_width = 800
    page.window_min_height = 600
    
    # Create main components
    header = create_header()
    tabs = ft.Tabs(
        selected_index=0,
        animation_duration=300,
        tabs=[
            create_subtitle_tab(page),
            create_speech_tab(page)
        ],
        expand=True
    )
    footer = create_footer()
    
    # Main layout
    page.add(
        ft.Column([
            header,
            tabs,
            footer
        ], expand=True)
    )