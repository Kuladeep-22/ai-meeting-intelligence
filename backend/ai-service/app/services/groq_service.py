import os

from dotenv import load_dotenv
from groq import Groq


load_dotenv()


GROQ_API_KEY = os.getenv("GROQ_API_KEY")

if not GROQ_API_KEY:
    raise RuntimeError(
        "GROQ_API_KEY is not configured"
    )


client = Groq(
    api_key=GROQ_API_KEY
)


MODEL = "openai/gpt-oss-20b"


def generate_answer(
    question: str,
    context: str = ""
) -> str:

    prompt = f"""
You are an AI Meeting Intelligence Assistant.

You have access to information stored in the user's meeting
management system.

Your job is to answer the user's question using the supplied
system data.

IMPORTANT RULES:

1. Always use the supplied meeting data when answering questions
   about meetings.

2. Use decisions when the user asks about decisions.

3. Use action items when the user asks about tasks, assignments,
   deadlines, or responsibilities.

4. Use risks when the user asks about risks, severity, owners,
   deadlines, or risk explanations.

5. You can combine information from meetings, decisions,
   action items and risks when the question requires it.

6. Never invent meeting information.

7. If the requested information is not present in the supplied
   data, clearly say that the information is not currently stored.

8. For "next meeting" questions, identify the earliest upcoming
   meeting based on date and start time.

9. If there are no meetings, say that there are no meetings
   currently stored for the user.

10. For general questions unrelated to stored meeting data,
    answer normally using your general knowledge.

11. Give concise but useful answers.

12. If useful, organize answers using bullet points.

SYSTEM DATA:

{context}

USER QUESTION:

{question}
"""

    response = client.chat.completions.create(
        model=MODEL,
        messages=[
            {
                "role": "system",
                "content": (
                    "You are a reliable AI Meeting Intelligence "
                    "Assistant. Never invent database facts."
                )
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.2,
        max_completion_tokens=2048,
    )

    return (
        response
        .choices[0]
        .message
        .content
    )