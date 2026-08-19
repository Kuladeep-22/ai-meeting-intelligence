import pytest

from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture(scope="session")
def client():
    """
    Shared TestClient
    """
    return TestClient(app)


@pytest.fixture
def sample_user():
    return {
        "full_name": "John Doe",
        "email": "john@example.com",
        "password": "password123"
    }


@pytest.fixture
def sample_team():
    return {
        "name": "Development Team",
        "description": "Handles application development"
    }


@pytest.fixture
def sample_meeting():
    return {
        "title": "Sprint Planning",
        "description": "Weekly Sprint Planning",
        "meeting_date": "2026-08-06",
        "organizer": "Rahul"
    }


@pytest.fixture
def auth_token(client, sample_user):
    """
    Register user if needed.
    """

    client.post(
        "/auth/register",
        json=sample_user
    )

    response = client.post(
        "/auth/login",
        json={
            "email": sample_user["email"],
            "password": sample_user["password"]
        }
    )

    if response.status_code == 200:
        return response.json()["access_token"]

    return None