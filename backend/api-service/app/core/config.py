from pydantic_settings import BaseSettings


class Settings(BaseSettings):

    APP_NAME: str = "AI Meeting Intelligence"

    APP_VERSION: str = "1.0.0"

    DATABASE_URL: str = (
        "postgresql://postgres:password@127.0.0.1:5432/meeting_ai"
    )

    SECRET_KEY: str = (
        "change-this-secret-key"
    )

    ALGORITHM: str = "HS256"

    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    FLASK_AI_URL: str = (
        "http://localhost:5000"
    )

    class Config:
        env_file = ".env"


settings = Settings()