import os

os.environ["OMP_NUM_THREADS"] = "1"
os.environ["MKL_NUM_THREADS"] = "1"
os.environ["TOKENIZERS_PARALLELISM"] = "false"

from flask import Flask

from app.routes.summarize import summarize_bp
from app.routes.decisions import decision_bp
from app.routes.actions import actions_bp
from app.routes.risks import risk_bp
from app.routes.sentiment import sentiment_bp
from app.routes.rag import rag_bp
from app.routes.assistant import assistant_bp


def create_app():
    app = Flask(__name__)

    # ---------------------------------------
    # Register AI/NLP routes
    # ---------------------------------------

    app.register_blueprint(summarize_bp)
    app.register_blueprint(decision_bp)
    app.register_blueprint(actions_bp)
    app.register_blueprint(risk_bp)
    app.register_blueprint(sentiment_bp)

    # ---------------------------------------
    # Register RAG routes
    # ---------------------------------------

    app.register_blueprint(rag_bp)

    # ---------------------------------------
    # Register AI Assistant
    # ---------------------------------------

    app.register_blueprint(assistant_bp)

    # ---------------------------------------
    # Health check
    # ---------------------------------------

    @app.route("/health", methods=["GET", "HEAD"])
    def health():
        return {
            "status": "AI Service is running"
        }

    # IMPORTANT
    return app


app = create_app()


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )