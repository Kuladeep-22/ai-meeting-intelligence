import chromadb

from app.config import (
    CHROMA_API_KEY,
    CHROMA_TENANT,
    CHROMA_DATABASE,
)


class ChromaVectorStore:

    def __init__(self):

        self.client = chromadb.CloudClient(
            tenant=CHROMA_TENANT,
            database=CHROMA_DATABASE,
            api_key=CHROMA_API_KEY,
        )

        self.collection = self.client.get_or_create_collection(
            name="meeting_documents"
        )

    def add_document(
        self,
        doc_id: str,
        text: str,
        embedding: list,
        metadata: dict | None = None,
    ):

        self.collection.add(
            ids=[doc_id],
            documents=[text],
            embeddings=[embedding],
            metadatas=[metadata or {}],
        )

    def search(
        self,
        embedding: list,
        top_k: int = 5,
    ):

        return self.collection.query(
            query_embeddings=[embedding],
            n_results=top_k,
        )

    def count(self):

        return self.collection.count()