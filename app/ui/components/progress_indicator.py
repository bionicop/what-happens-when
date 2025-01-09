import flet as ft

class ProgressIndicator(ft.UserControl):
    def __init__(self):
        super().__init__()
        self.value = 0
    
    def build(self):
        self.progress_bar = ft.ProgressBar(
            width=400,
            color="primary",
            value=self.value
        )
        
        self.status_text = ft.Text(
            "Ready",
            size=14,
            color=ft.colors.GREY_700
        )
        
        return ft.Container(
            content=ft.Column([
                self.progress_bar,
                self.status_text
            ], alignment=ft.MainAxisAlignment.CENTER),
            padding=20
        )
    
    def update_progress(self, value: float, status: str):
        self.value = value
        self.progress_bar.value = value
        self.status_text.value = status
        self.update()