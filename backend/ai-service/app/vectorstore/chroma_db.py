import chromadb

from app.config import CHROMA_PATH


class ChromaVectorStore:

    def __init__(self):

        self.client = chromadb.PersistentClient(
            path=str(CHROMA_PATH)
        )

        self.collection = self.client.get_or_create_collection(
            name="meeting_documents"
        )

    def add_document(
        self,
        doc_id: str,
        text: str,
        embedding: list
    ):

        self.collection.add(
            ids=[doc_id],
            documents=[text],
            embeddings=[embedding],
        )

    def search(
        self,
        embedding: list,
        top_k: int = 5
    ):

        return self.collection.query(
            query_embeddings=[embedding],
            n_results=top_k,
        )