from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_get_transcripts():

    response = client.get("/transcripts")

    assert response.status_code == 200


def test_get_transcript_by_id():

    response = client.get("/transcripts/1")

    assert response.status_code in [200, 404]


def test_create_transcript():

    response = client.post(
        "/transcripts",
        json={
            "meeting_id": 1,
            "transcript": """
            Rahul: We will move the release to October.
            Priya: I will update the deployment plan.
            Team: Deadline is September 25.
            """
        }
    )

    assert response.status_code in [200, 201]


def test_update_transcript():

    response = client.put(
        "/transcripts/1",
        json={
            "transcript": """
            Updated transcript content.
            """
        }
    )

    assert response.status_code in [200, 404]


def test_delete_transcript():

    response = client.delete("/transcripts/1")

    assert response.status_code in [200, 404]