import pytest

from app.app import app


@pytest.fixture
def client():

    app.config["TESTING"] = True

    with app.test_client() as client:
        yield client


def test_sentiment(client):

    response = client.post(
        "/sentiment",
        json={
            "transcript": """
            The meeting was successful.
            Everyone was happy with the progress.
            """
        }
    )

    assert response.status_code == 200

    data = response.get_json()

    assert "sentiment" in data

    assert "score" in data