from app.services.rag_service import (
    RAGService
)


def test_rag_search():

    documents = [

        "Project Alpha release moved to October.",

        "Deployment scheduled for September.",

        "Testing starts next Monday."
    ]

    result = RAGService.search(
        "October",
        documents
    )

    assert "results" in result

    assert isinstance(
        result["results"],
        list
    )

    assert len(
        result["results"]
    ) >= 1