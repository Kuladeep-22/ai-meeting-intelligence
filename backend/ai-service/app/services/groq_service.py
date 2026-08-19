import os
from pathlib import Path

from dotenv import load_dotenv
from groq import Groq


BASE_DIR = Path(__file__).resolve().parents[2]
ENV_FILE = BASE_DIR / ".env"

load_dotenv(ENV_FILE, override=True)


class GroqService:

    @staticmethod
    def generate(
        question: str,
        context: str = ""
    ):
        """
        Generate an AI response using Groq.

        question:
            The actual question entered by the user.

        context:
            Relevant information retrieved from ChromaDB.
            This can be empty for general questions.
        """

        api_key = os.getenv("GROQ_API_KEY")

        if not api_key:
            raise RuntimeError(
                "GROQ_API_KEY is not configured"
            )

        client = Groq(
            api_key=api_key.strip()
        )

        # -----------------------------------------
        # Build prompt
        # -----------------------------------------

        if context and context.strip():

            prompt = f"""
You are an AI Meeting Assistant.

You need to answer the user's actual question.

Relevant meeting information:
------------------------------
{context}
------------------------------

User question:
{question}

Instructions:

1. Answer the user's actual question.
2. Use the meeting information only when it is relevant.
3. Do not automatically talk about meetings for every question.
4. If the user says "hi", "hello", or another greeting, respond naturally.
5. If the user asks a general question, answer the general question.
6. If the question is about meetings, use the relevant meeting information.
7. Do not invent information that is not available.
8. Keep the answer clear and useful.
"""

        else:

            prompt = f"""
You are an AI Meeting Assistant.

Answer the user's question directly.

User question:
{question}

Instructions:

1. Answer the actual question.
2. Do not assume every question is about meetings.
3. For greetings such as "hi" or "hello", respond naturally.
4. For general questions, provide a useful general answer.
5. Do not invent meeting information.
"""

        # -----------------------------------------
        # Call Groq
        # -----------------------------------------

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are a helpful AI Meeting Assistant "
                        "for an AI Meeting Intelligence application."
                    )
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.4
        )

        return response.choices[0].message.content