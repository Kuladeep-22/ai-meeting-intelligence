from typing import List, Dict, Any

from app.services.embedding_service import EmbeddingService
from app.services.chroma_service import ChromaService


class RAGService:

    @staticmethod
    def search(
        question: str,
        top_k: int = 5
    ) -> Dict[str, Any]:
        """
        Search ChromaDB for meeting information relevant
        to the user's question.
        """

        if not question or not question.strip():
            return {
                "results": [],
                "sources": []
            }

        question = question.strip()

        try:
            # -----------------------------------------
            # 1. Convert question into embedding
            # -----------------------------------------
            embedding = EmbeddingService.generate_embedding(
                question
            )

            # -----------------------------------------
            # 2. Search ChromaDB
            # -----------------------------------------
            results = ChromaService.search(
                embedding=embedding,
                top_k=top_k
            )

            # -----------------------------------------
            # 3. Extract documents
            # -----------------------------------------
            documents = results.get(
                "documents",
                []
            )

            if not documents:
                return {
                    "results": [],
                    "sources": []
                }

            # Chroma can return nested lists
            if documents and isinstance(documents[0], list):
                documents = documents[0]

            # -----------------------------------------
            # 4. Clean documents
            # -----------------------------------------
            cleaned_documents = []

            for document in documents:

                if document and document.strip():

                    cleaned_documents.append(
                        document.strip()
                    )

            return {
                "results": cleaned_documents,
                "sources": cleaned_documents
            }

        except Exception as e:

            print(
                "RAG SEARCH ERROR:",
                str(e)
            )

            return {
                "results": [],
                "sources": [],
                "error": str(e)
            }

    @staticmethod
    def build_context(
        question: str,
        top_k: int = 5
    ) -> str:
        """
        Retrieve relevant meeting documents and
        convert them into context for the LLM.
        """

        result = RAGService.search(
            question=question,
            top_k=top_k
        )

        documents = result.get(
            "results",
            []
        )

        if not documents:
            return ""

        context_parts = []

        for index, document in enumerate(
            documents,
            start=1
        ):

            context_parts.append(
                f"Meeting Context {index}:\n{document}"
            )

        return "\n\n".join(
            context_parts
        )