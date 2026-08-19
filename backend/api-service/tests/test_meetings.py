from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_get_meetings():

    response = client.get("/meetings")

    assert response.status_code == 200


def test_create_meeting():

    response = client.post(
        "/meetings",
        json={
            "title": "Sprint Planning",
            "description": "Weekly planning",
            "meeting_date": "2026-08-01",
            "organizer": "Rahul"
        }
    )

    assert response.status_code in [200, 201]