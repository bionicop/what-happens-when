import flet as ft
from typing import List, Optional, Callable

class FileDropZone(ft.UserControl):
    def __init__(
        self,
        text: str,
        allowed_extensions: List[str],
        on_file_selected: Optional[Callable[[str], None]] = None
    ):
        super().__init__()
        self.text = text
        self.allowed_extensions = allowed_extensions
        self.on_file_selected = on_file_selected
        self.selected_file = None
    
    def build(self):
        def pick_files_result(e: ft.FilePickerResultEvent):
            if e.files and len(e.files) > 0:
                file = e.files[0]
                if any(file.path.lower().endswith(ext) for ext in self.allowed_extensions):
                    self.selected_file = file.path
                    self.file_name.value = file.name
                    if self.on_file_selected:
                        self.on_file_selected(file.path)
                else:
                    self.file_name.value = "Invalid file type!"
                self.update()

        self.pick_files_dialog = ft.FilePicker(
            on_result=pick_files_result
        )
        
        self.file_name = ft.Text(
            size=14,
            color=ft.colors.GREY_700
        )
        
        return ft.Container(
            content=ft.Column([
                ft.Icon(ft.icons.UPLOAD_FILE, size=48),
                ft.Text(self.text),
                ft.Text(
                    f"Supported formats: {', '.join(self.allowed_extensions)}",
                    size=12,
                    color=ft.colors.GREY_400
                ),
                self.file_name,
                ft.ElevatedButton(
                    "Select File",
                    icon=ft.icons.FILE_UPLOAD,
                    on_click=lambda _: self.pick_files_dialog.pick_files()
                )
            ], alignment=ft.MainAxisAlignment.CENTER),
            width=400,
            height=200,
            border=ft.border.all(2, ft.colors.GREY_400),
            border_radius=8,
            padding=20,
            alignment=ft.alignment.center
        )