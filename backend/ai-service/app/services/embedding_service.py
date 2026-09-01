import os
import requests


class EmbeddingService:

    MODEL_URL = (
        "https://router.huggingface.co/"
        "hf-inference/models/"
        "sentence-transformers/all-MiniLM-L6-v2"
    )

    @classmethod
    def generate_embedding(cls, text: str):

        if not text or not text.strip():
            return []

        token = os.getenv("HF_TOKEN")

        if not token:
            raise RuntimeError(
                "HF_TOKEN is not configured"
            )

        response = requests.post(
            cls.MODEL_URL,
            headers={
                "Authorization": f"Bearer {token}"
            },
            json={
                "inputs": text
            },
            timeout=60,
        )

        response.raise_for_status()

        result = response.json()

        return result