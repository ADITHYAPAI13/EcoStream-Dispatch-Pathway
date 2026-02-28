from __future__ import annotations

import os

import pathway as pw
from pathway.stdlib.indexing import TantivyBM25Factory
from pathway.xpacks.llm.document_store import DocumentStore
from pathway.xpacks.llm.llms import HFPipelineChat
from pathway.xpacks.llm.parsers import Utf8Parser
from pathway.xpacks.llm.question_answering import BaseRAGQuestionAnswerer

from app.license import configure_pathway_license_from_env


def main() -> None:
    configure_pathway_license_from_env()

    docs_path = os.getenv("ECOSTREAM_MANUALS", "./manuals")
    port = int(os.getenv("ECOSTREAM_RAG_PORT", "8766"))

    docs = pw.io.fs.read(
        docs_path,
        format="binary",
        with_metadata=True,
    )

    store = DocumentStore(
        docs=docs,
        retriever_factory=TantivyBM25Factory(),
        parser=Utf8Parser(),
        splitter=None,
    )

    # Pathway-only default: run an offline local model via HuggingFace pipeline.
    # Note: may require additional local deps depending on your environment (commonly `transformers` + `torch`).
    hf_model = os.getenv("ECOSTREAM_HF_MODEL", "gpt2")
    hf_device = os.getenv("ECOSTREAM_HF_DEVICE", "cpu")
    try:
        chat = HFPipelineChat(
            model=hf_model,
            device=hf_device,
            call_kwargs={"max_new_tokens": int(os.getenv("ECOSTREAM_HF_MAX_NEW_TOKENS", "256"))},
        )
    except Exception as e:  # transformers/torch not installed or model download fails
        raise SystemExit(
            "Failed to start local LLM backend for Pathway RAG.\n"
            "Install local LLM deps appropriate for your machine (commonly `transformers` + `torch`).\n"
            f"Underlying error: {e}"
        )

    rag = BaseRAGQuestionAnswerer(
        llm=chat,
        indexer=store,
        search_topk=6,
    )

    rag.build_server(host="0.0.0.0", port=port)
    rag.run_server()


if __name__ == "__main__":
    main()
