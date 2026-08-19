from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_register():
    response = client.post(
        "/auth/register",
        json={
            "full_name": "John Doe",
            "email": "john@example.com",
            "password": "password123"
        }
    )

    assert response.status_code in [200, 201]


def test_login():
    response = client.post(
        "/auth/login",
        json={
            "email": "john@example.com",
            "password": "password123"
        }
    )

    assert response.status_code == 200

    assert "access_token" in response.json()