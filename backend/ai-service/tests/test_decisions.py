import pytest

from app.app import app


@pytest.fixture
def client():

    app.config["TESTING"] = True

    with app.test_client() as client:
        yield client


def test_decision_extraction(client):

    response = client.post(
        "/decisions",
        json={
            "transcript": """
            We decided to release in October.
            The deployment strategy was approved.
            """
        }
    )

    assert response.status_code == 200

    data = response.get_json()

    assert "decisions" in data

    assert isinstance(
        data["decisions"],
        list
    )