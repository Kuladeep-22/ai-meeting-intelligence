import requests
from fastapi import HTTPException

AI_SERVICE_URL = "http://localhost:8001/chat"
AI_SERVICE_INDEX_URL = "http://localhost:8001/rag/index"


def ask_chatbot(question: str):

    try:
        response = requests.post(
            AI_SERVICE_URL,
            json={
                "question": question
            },
            timeout=30
        )

        response.raise_for_status()

        return response.json()

    except Exception as e:
        print(f"Error communicating with AI service: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"AI Service Error: {str(e)}"
        )


def index_document(doc_id: str, text: str):

    try:
        response = requests.post(
            AI_SERVICE_INDEX_URL,
            json={
                "doc_id": doc_id,
                "text": text,
            },
            timeout=30
        )

        response.raise_for_status()

        return response.json()

    except Exception as e:
        print(f"Error communicating with AI service in index_document: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"AI Service Error: {str(e)}"
        )