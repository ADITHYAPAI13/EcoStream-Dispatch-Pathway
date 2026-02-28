from __future__ import annotations

import json
import os
import threading
import urllib.error
import urllib.request
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from .pipeline import build_and_run_pipeline
from .state import FleetState


class DiagnoseRequest(BaseModel):
    unit_id: str = Field(..., min_length=1)
    question: str = Field(..., min_length=3)


state = FleetState()


def _start_pathway_once() -> None:
    t = threading.Thread(target=build_and_run_pipeline, args=(state,), daemon=True)
    t.start()


@asynccontextmanager
async def lifespan(app: FastAPI):
    _start_pathway_once()
    yield


app = FastAPI(title="EcoStream Pathway Backend", version="0.1.0", lifespan=lifespan)


def _cors_origins_from_env() -> list[str]:
    raw = os.getenv("ECOSTREAM_CORS_ORIGINS", "").strip()
    if not raw:
        return [
            "http://localhost:5173",
            "http://127.0.0.1:5173",
        ]
    return [o.strip() for o in raw.split(",") if o.strip()]


app.add_middleware(
    CORSMiddleware,
    allow_origins=_cors_origins_from_env(),
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


def _try_post_json(url: str, payload: dict, timeout_s: float = 2.5) -> tuple[int, object]:
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=data,
        headers={"Content-Type": "application/json", "Accept": "application/json"},
        method="POST",
    )

    try:
        with urllib.request.urlopen(req, timeout=timeout_s) as resp:
            raw = resp.read().decode("utf-8", errors="replace")
            try:
                return resp.getcode(), json.loads(raw)
            except json.JSONDecodeError:
                return resp.getcode(), raw
    except urllib.error.HTTPError as e:
        try:
            raw = e.read().decode("utf-8", errors="replace")
            try:
                return e.code, json.loads(raw)
            except json.JSONDecodeError:
                return e.code, raw
        except Exception:
            return e.code, {"error": str(e)}
    except urllib.error.URLError as e:
        return 0, {"error": str(e)}


def _call_docstore_retrieve(base_url: str, query: str, k: int = 3) -> dict:
    status, body = _try_post_json(f"{base_url}/v1/retrieve", {"query": query, "k": k})
    if 200 <= status < 300:
        return {"ok": True, "response": body}
    return {"ok": False, "status": status, "response": body}


def _call_rag_server(base_url: str, unit_id: str, question: str) -> dict:
    endpoints = [
        "/v1/answer",
        "/answer",
        "/v1/qa",
    ]
    payloads = [
        {"question": question, "unit_id": unit_id},
        {"query": question, "unit_id": unit_id},
        {"question": f"Unit {unit_id}: {question}"},
    ]

    last_error: dict | None = None
    for endpoint in endpoints:
        for payload in payloads:
            status, body = _try_post_json(f"{base_url}{endpoint}", payload)
            if 200 <= status < 300:
                return {"ok": True, "endpoint": endpoint, "payload": payload, "response": body}

            # Keep the most informative failure (validation errors often come back as 422).
            if status in (400, 404, 405, 415, 422) or last_error is None:
                last_error = {"status": status, "endpoint": endpoint, "payload": payload, "response": body}

    return {
        "ok": False,
        "error": "RAG server did not accept the request. Check that backend/rag_service.py is running and which endpoint it exposes.",
        "last_error": last_error,
    }


@app.get("/api/health")
def health():
    return {"ok": True}


@app.get("/api/fleet")
def fleet():
    return {"units": state.units()}


@app.get("/api/alerts")
def alerts():
    return {"alerts": state.alerts()}


@app.post("/api/diagnose")
def diagnose(req: DiagnoseRequest):
    rag_port = int(os.getenv("ECOSTREAM_RAG_PORT", "8766"))
    base_url = f"http://127.0.0.1:{rag_port}"

    rag = _call_rag_server(base_url, unit_id=req.unit_id, question=req.question)

    # Pathway-only fallback: if the RAG server isn't available, retrieve relevant manual chunks
    # from the Pathway DocumentStore and return a deterministic checklist.
    if not rag.get("ok"):
        docstore_port = int(os.getenv("ECOSTREAM_DOCSTORE_PORT", "8765"))
        docstore_url = f"http://127.0.0.1:{docstore_port}"
        retrieve = _call_docstore_retrieve(
            docstore_url,
            query=f"{req.unit_id}: {req.question}",
            k=int(os.getenv("ECOSTREAM_DOCSTORE_K", "3")),
        )
        steps = [
            "Confirm coolant level and active cooling fan operation.",
            "Inspect radiator/airflow obstructions; check for debris and clogged fins.",
            "Verify oil pressure/level and look for leaks; overheating can be load-related.",
            "Check sensor wiring/connectors and compare against a redundant temperature reading if available.",
            "If temperature remains high, reduce load and plan a service stop per manual guidance.",
        ]
        return {
            "unit_id": req.unit_id,
            "question": req.question,
            "mode": "docstore_fallback",
            "docstore_url": docstore_url,
            "retrieve": retrieve,
            "steps": steps,
            "rag_url": base_url,
            "rag": rag,
        }

    return {
        "unit_id": req.unit_id,
        "question": req.question,
        "mode": "rag",
        "rag_url": base_url,
        "rag": rag,
    }


def main() -> None:
    import uvicorn

    port = int(os.getenv("ECOSTREAM_API_PORT", "8780"))
    uvicorn.run("app.server:app", host="0.0.0.0", port=port, reload=False)


if __name__ == "__main__":
    main()
