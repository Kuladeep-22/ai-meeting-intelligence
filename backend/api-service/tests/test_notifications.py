from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_get_notifications():

    response = client.get("/notifications")

    assert response.status_code == 200


def test_create_notification():

    response = client.post(
        "/notifications",
        json={
            "user_id": 1,
            "title": "Meeting Reminder",
            "message": "Sprint meeting starts at 10 AM"
        }
    )

    assert response.status_code in [200, 201]