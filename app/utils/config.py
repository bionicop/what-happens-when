import json
from pathlib import Path
from typing import Dict, Any

DEFAULT_CONFIG = {
    "port": 8080,
    "max_workers": 15,
    "batch_size": 10,
    "retry_attempts": 3,
    "cleanup_days": 7,
    "default_voice": "en-US-JennyNeural",
    "temp_dir": "temp_files",
    "supported_languages": ["en", "es", "fr", "de", "hi", "ja", "ko", "zh"]
}

def load_config() -> Dict[str, Any]:
    """Load configuration from config.json or return default config"""
    config_path = Path("config.json")
    
    try:
        if config_path.exists():
            with open(config_path, 'r') as f:
                user_config = json.load(f)
                return {**DEFAULT_CONFIG, **user_config}
    except Exception as e:
        print(f"Error loading config: {e}")
    
    return DEFAULT_CONFIG

def save_config(config: Dict[str, Any]) -> bool:
    """Save configuration to config.json"""
    try:
        with open("config.json", 'w') as f:
            json.dump(config, f, indent=4)
        return True
    except Exception as e:
        print(f"Error saving config: {e}")
        return False