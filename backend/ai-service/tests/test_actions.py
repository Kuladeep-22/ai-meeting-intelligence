import pytest

from app.app import app


@pytest.fixture
def client():

    app.config["TESTING"] = True

    with app.test_client() as client:
        yield client


def test_action_items(client):

    response = client.post(
        "/actions",
        json={
            "transcript": """
            Rahul will update deployment.
            Priya should prepare documents.
            Testing team must complete regression testing.
            """
        }
    )

    assert response.status_code == 200

    data = response.get_json()

    assert "action_items" in data

    assert isinstance(
        data["action_items"],
        list
    )