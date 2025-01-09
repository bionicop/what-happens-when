from datetime import datetime
from typing import Tuple

def format_timestamp(seconds: float) -> str:
    """Convert seconds to SRT timestamp format"""
    hours = int(seconds // 3600)
    minutes = int((seconds % 3600) // 60)
    seconds = seconds % 60
    milliseconds = int((seconds % 1) * 1000)
    seconds = int(seconds)
    
    return f"{hours:02d}:{minutes:02d}:{seconds:02d},{milliseconds:03d}"

def parse_timestamp(timestamp: str) -> float:
    """Convert SRT timestamp to seconds"""
    time_parts = timestamp.replace(',', ':').split(':')
    hours = int(time_parts[0])
    minutes = int(time_parts[1])
    seconds = int(time_parts[2])
    milliseconds = int(time_parts[3])
    
    return hours * 3600 + minutes * 60 + seconds + milliseconds / 1000

def get_duration(start: str, end: str) -> float:
    """Calculate duration between two timestamps"""
    return parse_timestamp(end) - parse_timestamp(start)