def test_dashboard(client):

    response = client.get(
        "/analytics/dashboard"
    )

    assert response.status_code == 200


def test_dashboard_response(client):

    response = client.get(
        "/analytics/dashboard"
    )

    if response.status_code == 200:

        data = response.json()

        assert "meetings" in data

        assert "decisions" in data

        assert "tasks" in data

        assert "risks" in data