from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_get_risks():

    response = client.get("/risks")

    assert response.status_code == 200


def test_create_risk():

    response = client.post(
        "/risks",
        json={
            "meeting_id": 1,
            "title": "Delay Risk",
            "description": "Project may miss deadline",
            "severity": "High",
            "owner": "Rahul",
            "status": "Open"
        }
    )

    assert response.status_code in [200, 201]