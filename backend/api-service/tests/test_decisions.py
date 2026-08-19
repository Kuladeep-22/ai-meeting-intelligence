from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_get_decisions():

    response = client.get("/decisions")

    assert response.status_code == 200


def test_create_decision():

    response = client.post(
        "/decisions",
        json={
            "meeting_id": 1,
            "title": "Release Date",
            "description": "Move release to October",
            "owner": "Rahul",
            "status": "Pending"
        }
    )

    assert response.status_code in [200, 201]