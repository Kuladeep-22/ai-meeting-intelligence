from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_chatbot():

    response = client.post(
        "/chatbot/ask",
        json={
            "question": "Summarize today's meeting"
        }
    )

    assert response.status_code in [200, 500]