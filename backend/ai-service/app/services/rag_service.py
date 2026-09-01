from typing import Dict, Any

from app.services.chroma_service import ChromaService


class RAGService:

    @staticmethod
    def search(
        question: str,
        top_k: int = 5,
    ) -> Dict[str, Any]:

        if not question or not question.strip():

            return {
                "results": [],
                "sources": [],
            }

        question = question.strip()

        try:

            results = ChromaService.search(
                question=question,
                top_k=top_k,
            )

            documents = results.get(
                "documents",
                [],
            )

            if not documents:

                return {
                    "results": [],
                    "sources": [],
                }

            # Chroma returns nested lists
            if (
                documents
                and isinstance(documents[0], list)
            ):

                documents = documents[0]

            cleaned_documents = []

            for document in documents:

                if document and document.strip():

                    cleaned_documents.append(
                        document.strip()
                    )

            return {
                "results": cleaned_documents,
                "sources": cleaned_documents,
            }

        except Exception as e:

            print(
                "RAG SEARCH ERROR:",
                str(e),
            )

            return {
                "results": [],
                "sources": [],
                "error": str(e),
            }

    @staticmethod
    def build_context(
        question: str,
        top_k: int = 5,
    ) -> str:

        result = RAGService.search(
            question=question,
            top_k=top_k,
        )

        documents = result.get(
            "results",
            [],
        )

        if not documents:

            return ""

        context_parts = []

        for index, document in enumerate(
            documents,
            start=1,
        ):

            context_parts.append(
                f"Meeting Context {index}:\n{document}"
            )

        return "\n\n".join(
            context_parts
        )