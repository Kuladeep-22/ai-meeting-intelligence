from pathlib import Path
from typing import Any

from app.models.llm_client import LLMClient
from app.services.rag_service import RAGService


class ChatService:

    PROMPT_PATH = (
        Path(__file__).resolve().parent.parent
        / "prompts"
        / "chatbot_prompt.txt"
    )

    MAX_HISTORY_MESSAGES = 20

    @classmethod
    def load_prompt(cls) -> str:
        """
        Load chatbot system prompt.
        """

        try:

            return cls.PROMPT_PATH.read_text(
                encoding="utf-8"
            )

        except FileNotFoundError:

            return """
You are an AI Meeting Intelligence Assistant.

Answer questions about meetings, decisions,
tasks, risks and action items.

Use the provided meeting context when available.

Do not invent meeting information.
If the information is not available,
clearly say that you do not have enough
information.
"""

    @classmethod
    def clean_history(
        cls,
        conversation: list[dict[str, Any]]
    ) -> list[dict[str, str]]:
        """
        Clean and limit conversation history.
        """

        cleaned = []

        for message in conversation:

            role = message.get("role")

            content = message.get(
                "content",
                ""
            )

            if role not in [
                "user",
                "assistant"
            ]:
                continue

            if not content:
                continue

            cleaned.append(
                {
                    "role": role,
                    "content": str(content)
                }
            )

        return cleaned[
            -cls.MAX_HISTORY_MESSAGES:
        ]

    @classmethod
    async def get_meeting_context(
        cls,
        message: str
    ) -> str:
        """
        Search meeting information using RAG.

        If RAG is unavailable, the chatbot
        can still answer normally.
        """

        try:

            rag_service = RAGService()

            result = rag_service.search(
                message
            )

            if not result:
                return ""

            if isinstance(result, list):

                context_parts = []

                for item in result:

                    if isinstance(
                        item,
                        dict
                    ):

                        text = (
                            item.get("text")
                            or item.get(
                                "document",
                                ""
                            )
                        )

                        if text:
                            context_parts.append(
                                str(text)
                            )

                    else:
                        context_parts.append(
                            str(item)
                        )

                return "\n\n".join(
                    context_parts
                )

            return str(result)

        except Exception as exc:

            print(
                f"RAG search error: {exc}"
            )

            return ""

    @classmethod
    def build_messages(
        cls,
        system_prompt: str,
        conversation: list[dict[str, str]],
        meeting_context: str,
        current_message: str
    ) -> list[dict[str, str]]:
        """
        Build the final message list sent
        to the LLM.
        """

        messages = [
            {
                "role": "system",
                "content": system_prompt
            }
        ]

        if meeting_context:

            context_message = f"""
Relevant meeting information:

{meeting_context}

Use this information when answering
the user's question.

Do not assume information that is not
present in the context.
"""

            messages.append(
                {
                    "role": "system",
                    "content": context_message
                }
            )

        messages.extend(
            conversation
        )

        messages.append(
            {
                "role": "user",
                "content": current_message
            }
        )

        return messages

    @classmethod
    async def generate_response(
        cls,
        message: str,
        conversation: list[dict[str, Any]] | None = None,
        session_id: int | None = None
    ) -> str:
        """
        Generate an AI response using:

        1. System prompt
        2. Conversation history
        3. RAG meeting context
        4. Current user message
        """

        if not message or not message.strip():

            raise ValueError(
                "Message cannot be empty."
            )

        message = message.strip()

        conversation = conversation or []

        cleaned_history = (
            cls.clean_history(
                conversation
            )
        )

        system_prompt = (
            cls.load_prompt()
        )

        meeting_context = (
            await cls.get_meeting_context(
                message
            )
        )

        messages = cls.build_messages(
            system_prompt=system_prompt,
            conversation=cleaned_history,
            meeting_context=meeting_context,
            current_message=message
        )

        try:

            llm = LLMClient()

            response = await llm.generate(
                messages=messages
            )

            if not response:

                return (
                    "I couldn't generate a response "
                    "right now. Please try again."
                )

            return str(response).strip()

        except Exception as exc:

            print(
                f"LLM error: {exc}"
            )

            return (
                "I'm having trouble processing "
                "your request right now. "
                "Please try again."
            )