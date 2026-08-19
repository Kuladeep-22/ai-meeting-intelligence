import requests

from app.core.config import settings


class AIClient:

    @staticmethod
    def analyze_transcript(
        transcript: str
    ):

        response = requests.post(
            f"{settings.FLASK_AI_URL}/analyze",
            json={
                "transcript": transcript
            },
            timeout=60,
        )

        response.raise_for_status()

        return response.json()

    @staticmethod
    def ask_chatbot(
        question: str
    ):

        response = requests.post(
            f"{settings.FLASK_AI_URL}/chat",
            json={
                "question": question
            },
            timeout=60,
        )

        response.raise_for_status()

        return response.json()