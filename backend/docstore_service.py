from __future__ import annotations

import os

import pathway as pw
from pathway.stdlib.indexing import TantivyBM25Factory
from pathway.xpacks.llm.document_store import DocumentStore
from pathway.xpacks.llm.parsers import Utf8Parser
from pathway.xpacks.llm.servers import DocumentStoreServer

from app.license import configure_pathway_license_from_env


def main() -> None:
    configure_pathway_license_from_env()

    docs_path = os.getenv("ECOSTREAM_MANUALS", "./manuals")
    port = int(os.getenv("ECOSTREAM_DOCSTORE_PORT", "8765"))

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

    server = DocumentStoreServer(host="127.0.0.1", port=port, document_store=store)
    server.run(threaded=False, with_cache=False)


if __name__ == "__main__":
    main()
