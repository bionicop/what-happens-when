import flet as ft

class AudioRecorder(ft.UserControl):
    def __init__(self):
        super().__init__()
        self.recording = False
    
    def build(self):
        self.record_button = ft.IconButton(
            icon=ft.icons.MIC,
            icon_color=ft.colors.RED_400,
            icon_size=48,
            tooltip="Start Recording",
            on_click=self.toggle_recording
        )
        
        return ft.Container(
            content=ft.Column([
                ft.Text(
                    "Click to start recording",
                    size=16,
                    text_align=ft.TextAlign.CENTER
                ),
                self.record_button
            ], alignment=ft.MainAxisAlignment.CENTER),
            padding=20
        )
    
    def toggle_recording(self, e):
        self.recording = not self.recording
        self.record_button.icon = ft.icons.STOP if self.recording else ft.icons.MIC
        self.record_button.tooltip = "Stop Recording" if self.recording else "Start Recording"
        self.update()