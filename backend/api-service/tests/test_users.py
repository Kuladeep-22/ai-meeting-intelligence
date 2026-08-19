from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_get_users():

    response = client.get("/users")

    assert response.status_code == 200


def test_get_user_by_id():

    response = client.get("/users/1")

    assert response.status_code in [200, 404]