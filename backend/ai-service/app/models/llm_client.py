import os

from dotenv import load_dotenv
from groq import Groq


load_dotenv()


class LLMClient:

    def __init__(self):

        api_key = os.getenv("GROQ_API_KEY")

        if not api_key:
            raise RuntimeError(
                "GROQ_API_KEY is not configured"
            )

        self.client = Groq(
            api_key=api_key
        )

        self.model = os.getenv(
            "GROQ_MODEL",
            "llama-3.3-70b-versatile"
        )

    def generate(self, prompt: str):

        response = self.client.chat.completions.create(
            model=self.model,

            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ],

            temperature=0.3,
            max_tokens=800
        )

        return response.choices[0].message.content