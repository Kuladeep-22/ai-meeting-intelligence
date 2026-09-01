from pathlib import Path
from pydantic_settings import BaseSettings

BASE_DIR = Path(__file__).resolve().parent.parent
class Settings(BaseSettings):
    base_dir: Path = Path(__file__).resolve().parent.parent
    chroma_path: Path = base_dir / "chroma_db"

settings = Settings()
CHROMA_PATH = BASE_DIR / "chroma_db"