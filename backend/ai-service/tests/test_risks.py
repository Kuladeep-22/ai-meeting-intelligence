import pytest

from app.app import app


@pytest.fixture
def client():

    app.config["TESTING"] = True

    with app.test_client() as client:
        yield client


def test_risk_detection(client):

    response = client.post(
        "/risks",
        json={
            "transcript": """
            There is a high risk of delay.
            Deployment may fail because of server issues.
            """
        }
    )

    assert response.status_code == 200

    data = response.get_json()

    assert "risks" in data

    assert isinstance(
        data["risks"],
        list
    )