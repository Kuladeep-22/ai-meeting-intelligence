import pytest

from app.app import app


@pytest.fixture
def client():

    app.config["TESTING"] = True

    with app.test_client() as client:
        yield client


def test_summary(client):

    response = client.post(
        "/summarize",
        json={
            "transcript": """
            Today's meeting discussed the October release.
            Rahul will update the deployment plan.
            Priya will prepare documentation.
            """
        }
    )

    assert response.status_code == 200

    data = response.get_json()

    assert "summary" in data