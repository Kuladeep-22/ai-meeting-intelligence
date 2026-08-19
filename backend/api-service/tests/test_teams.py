def test_get_teams(client):

    response = client.get("/teams")

    assert response.status_code == 200


def test_get_team(client):

    response = client.get("/teams/1")

    assert response.status_code in [200, 404]


def test_create_team(client):

    response = client.post(
        "/teams",
        json={
            "name": "Backend Team",
            "description": "Develops APIs"
        }
    )

    assert response.status_code in [200, 201]


def test_update_team(client):

    response = client.put(
        "/teams/1",
        json={
            "name": "Updated Team",
            "description": "Updated Description"
        }
    )

    assert response.status_code in [200, 404]


def test_delete_team(client):

    response = client.delete("/teams/1")

    assert response.status_code in [200, 404]