import flet as ft

class TranslationControls(ft.UserControl):
    def __init__(self):
        super().__init__()
    
    def build(self):
        self.start_button = ft.ElevatedButton(
            text="Start Translation",
            icon=ft.icons.PLAY_ARROW,
            disabled=True
        )
        
        self.pause_button = ft.ElevatedButton(
            text="Pause",
            icon=ft.icons.PAUSE,
            disabled=True
        )
        
        self.cancel_button = ft.ElevatedButton(
            text="Cancel",
            icon=ft.icons.CANCEL,
            disabled=True
        )
        
        return ft.Container(
            content=ft.Row([
                self.start_button,
                self.pause_button,
                self.cancel_button
            ], alignment=ft.MainAxisAlignment.CENTER),
            padding=20
        )