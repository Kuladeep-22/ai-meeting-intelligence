from groq import Groq

import os


class LLMClient:

    def __init__(self):

        self.client = Groq(
            api_key=os.getenv("GROQ_API_KEY")
        )

        self.model = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")

    def generate(
        self,
        prompt: str
    ):

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

        return (
            response
            .choices[0]
            .message
            .content
        )