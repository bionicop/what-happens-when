from pathlib import Path
import shutil
import time
from typing import List

def create_temp_directory(base_dir: str = "temp_files") -> Path:
    """Create temporary directory if it doesn't exist"""
    temp_dir = Path(base_dir)
    temp_dir.mkdir(exist_ok=True)
    return temp_dir

def cleanup_old_files(directory: Path, max_age_days: int = 7) -> None:
    """Remove files older than max_age_days"""
    if not directory.exists():
        return
    
    current_time = time.time()
    max_age_seconds = max_age_days * 24 * 60 * 60
    
    for item in directory.glob("**/*"):
        if item.is_file():
            file_age = current_time - item.stat().st_mtime
            if file_age > max_age_seconds:
                try:
                    item.unlink()
                except Exception as e:
                    print(f"Error deleting {item}: {e}")

def get_safe_filename(filename: str) -> str:
    """Convert filename to safe version"""
    return "".join(c for c in filename if c.isalnum() or c in "._- ").strip()

def ensure_directory(path: Path) -> None:
    """Ensure directory exists, create if necessary"""
    path.mkdir(parents=True, exist_ok=True)