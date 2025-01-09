import flet as ft

def create_header() -> ft.Container:
    """Create application header"""
    return ft.Container(
        content=ft.Column([
            ft.Row([
                ft.Text(
                    "Speech Translation App",
                    size=32,
                    weight=ft.FontWeight.BOLD,
                    color=ft.colors.PRIMARY
                ),
                ft.IconButton(
                    icon=ft.icons.SETTINGS,
                    tooltip="Settings",
                    on_click=lambda e: print("Settings clicked")
                )
            ], alignment=ft.MainAxisAlignment.SPACE_BETWEEN),
            ft.Divider(height=1)
        ]),
        padding=ft.padding.only(bottom=20)
    )