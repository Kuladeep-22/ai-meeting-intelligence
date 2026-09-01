from typing import Dict, Any

from app.services.chroma_service import ChromaService


class RetrievalService:

    @staticmethod
    def index(
        doc_id: str,
        text: str,
        metadata: dict | None = None,
    ) -> Dict[str, Any]:

        return ChromaService.add_document(
            document_id=doc_id,
            text=text,
            metadata=metadata,
        )

    @staticmethod
    def retrieve(
        question: str,
        top_k: int = 5,
    ) -> Dict[str, Any]:

        return ChromaService.search(
            question=question,
            top_k=top_k,
        )


retrieval_service = RetrievalService()