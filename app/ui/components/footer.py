import flet as ft

def create_footer() -> ft.Container:
    """Create application footer"""
    return ft.Container(
        content=ft.Column([
            ft.Divider(height=1),
            ft.Row([
                ft.Text("Created by "),
                ft.TextButton(
                    "bionicop",
                    url="https://github.com/bionicop",
                    tooltip="Visit GitHub Profile"
                )
            ], alignment=ft.MainAxisAlignment.CENTER)
        ]),
        padding=ft.padding.only(top=20)
    )