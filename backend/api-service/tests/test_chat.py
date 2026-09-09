from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_chat_websocket_invalid_session():

    with client.websocket_connect(
        "/api/v1/chatbot/ws/999999"
    ) as websocket:

        response = websocket.receive_json()

        assert response["type"] == "error"

        assert (
            response["message"]
            == "Chat session not found"
        )


def test_chat_api_is_available():

    response = client.get("/docs")

    assert response.status_code == 200