import os
from pathlib import Path
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent
class Settings(BaseSettings):
    base_dir: Path = Path(__file__).resolve().parent.parent
    chroma_path: Path = base_dir / "chroma_db"

load_dotenv()

CHROMA_API_KEY = os.getenv("CHROMA_API_KEY")
CHROMA_TENANT = os.getenv("CHROMA_TENANT")
CHROMA_DATABASE = os.getenv("CHROMA_DATABASE")

settings = Settings()
CHROMA_PATH = BASE_DIR / "chroma_db"