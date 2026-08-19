import chromadb

from app.config import CHROMA_PATH
from app.services.embedding_service import EmbeddingService


class ChromaService:

    client = chromadb.PersistentClient(
        path=str(CHROMA_PATH)
    )

    collection = client.get_or_create_collection(
        name="meeting_documents"
    )

    @classmethod
    def add_document(
        cls,
        document_id: str,
        text: str,
        metadata: dict | None = None
    ):

        embedding = EmbeddingService.generate_embedding(text)

        cls.collection.add(
            ids=[document_id],
            documents=[text],
            embeddings=[embedding],
            metadatas=[metadata or {}]
        )

        return {
            "success": True,
            "message": "Document stored successfully",
            "id": document_id
        }

    @classmethod
    def search(
        cls,
        question: str,
        top_k: int = 5
    ):

        question_embedding = (
            EmbeddingService.generate_embedding(
                question
            )
        )

        return cls.collection.query(
            query_embeddings=[question_embedding],
            n_results=top_k
        )

        return results

    @classmethod
    def count(cls):
        return cls.collection.count()