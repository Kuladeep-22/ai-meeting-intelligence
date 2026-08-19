import pytest

from app.app import app


@pytest.fixture
def client():

    app.config["TESTING"] = True

    with app.test_client() as client:
        yield client


def test_chatbot(client):

    response = client.post(
        "/chat",
        json={
            "question": "Summarize today's meeting."
        }
    )

    assert response.status_code == 200

    data = response.get_json()

    assert "answer" in data