from importlib.metadata import metadata

from app.models.embedding_model import (
    EmbeddingModel,
)

from app.vectorstore.chroma_db import (
    ChromaVectorStore,
)


class RetrievalService:

    def __init__(self):

        self.embedding = EmbeddingModel()

        self.vector_db = ChromaVectorStore()

    def index(
        self,
        doc_id: str,
        text: str,
        metadata: dict | None = None,
    ):

        embedding = self.embedding.encode(
            text
        )

        self.vector_db.add_document(
            doc_id,
            text,
            embedding,
            metadata,
        )

    def retrieve(
        self,
        question: str,
        top_k: int = 5,
    ):

        embedding = self.embedding.encode(
            question
        )

        results = self.vector_db.search(
            embedding,
            top_k=top_k
        )

        return results


# Shared singleton so the embedding model and vector store are loaded once.
retrieval_service = RetrievalService()