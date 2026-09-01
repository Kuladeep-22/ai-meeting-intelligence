import chromadb

from app.config import (
    CHROMA_API_KEY,
    CHROMA_TENANT,
    CHROMA_DATABASE,
)


class ChromaService:

    client = chromadb.CloudClient(
        tenant=CHROMA_TENANT,
        database=CHROMA_DATABASE,
        api_key=CHROMA_API_KEY,
    )

    collection = client.get_or_create_collection(
        name="meeting_documents"
    )

    @classmethod
    def add_document(
        cls,
        document_id: str,
        text: str,
        metadata: dict | None = None,
    ):

        cls.collection.add(
            ids=[document_id],
            documents=[text],
            metadatas=[metadata or {}],
        )

        return {
            "success": True,
            "message": "Document stored successfully",
            "id": document_id,
        }

    @classmethod
    def search(
        cls,
        question: str,
        top_k: int = 5,
    ):

        return cls.collection.query(
            query_texts=[question],
            n_results=top_k,
        )

    @classmethod
    def count(cls):

        return cls.collection.count()