from flask import Flask

from app.routes.assistant import assistant_bp


def create_app():
    app = Flask(__name__)

    app.register_blueprint(
        assistant_bp,
    )

    @app.get("/")
    def health_check():
        return {
            "message": "AI Service is running"
        }

    return app


app = create_app()


if __name__ == "__main__":
    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True,
        use_reloader=False
    )