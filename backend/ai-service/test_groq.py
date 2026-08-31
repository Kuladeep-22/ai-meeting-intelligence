import os
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

api_key = os.getenv("GROQ_API_KEY")

if not api_key:
    raise RuntimeError("GROQ_API_KEY not found")

print("API KEY FOUND:", True)
print("PREFIX:", api_key[:8])
print("LENGTH:", len(api_key))

client = Groq(api_key=api_key)

print("Sending test request to Groq...")

try:
    response = client.chat.completions.create(
        model="openai/gpt-oss-120b",
        messages=[
            {
                "role": "system",
                "content": "You are a helpful AI meeting assistant."
            },
            {
                "role": "user",
                "content": "Say hello in one short sentence."
            }
        ],
        temperature=0.2,
    )

    print("\n========== SUCCESS ==========")
    print(response.choices[0].message.content)
    print("=============================")

except Exception as e:
    print("\n========== GROQ ERROR ==========")
    print("TYPE:", type(e).__name__)
    print("MESSAGE:", str(e))
    print("================================")