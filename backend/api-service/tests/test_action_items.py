from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_get_action_items():

    response = client.get("/action-items")

    assert response.status_code == 200


def test_get_action_item_by_id():

    response = client.get("/action-items/1")

    assert response.status_code in [200, 404]


def test_create_action_item():

    response = client.post(
        "/action-items",
        json={
            "meeting_id": 1,
            "title": "Update Deployment Plan",
            "assigned_to": "Rahul",
            "deadline": "2026-09-25",
            "status": "Pending"
        }
    )

    assert response.status_code in [200, 201]


def test_update_action_item():

    response = client.put(
        "/action-items/1",
        json={
            "title": "Deploy Application",
            "assigned_to": "Rahul",
            "deadline": "2026-09-28",
            "status": "Completed"
        }
    )

    assert response.status_code in [200, 404]


def test_delete_action_item():

    response = client.delete("/action-items/1")

    assert response.status_code in [200, 404]