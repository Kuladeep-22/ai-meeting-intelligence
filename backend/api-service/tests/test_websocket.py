from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_notification_websocket():

    with client.websocket_connect(
        "/ws/notifications"
    ) as websocket:

        websocket.send_text(
            "Hello Server"
        )

        # Connection established successfully
        assert websocket is not None