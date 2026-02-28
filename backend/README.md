# EcoStream Backend (Pathway)

This folder adds a **Pathway-powered backend** to the Vite/React dashboard.

## What’s included

- **Streaming telemetry connector**: custom `pw.io.python.ConnectorSubject` generating live unit telemetry.
- **Streaming transformations + temporal windows**: sliding window feature engineering + anomaly alerts.
- **Native Document Store**: Pathway `DocumentStore` over `./manuals` (no external vector DB).
- **LLM xPack RAG server**: optional Pathway RAG HTTP server (can run with a local model; no external provider key required).
- **FastAPI API**: `/api/fleet`, `/api/alerts`, `/api/diagnose`.

## Setup

Python note: the backend package declares `requires-python = ">=3.10,<3.13"`.
If your system default is newer (e.g. 3.13/3.14), create the venv with Python 3.10–3.12.

### Note on `lib64` inside the venv (Linux)

In `backend/.venv`, it’s normal to see both `lib/` and `lib64/`. On most Linux systems
`lib64` is just a symlink to `lib`, so packages are **not** installed twice.

### Create a venv with Python 3.12 (Linux)

If `python3 --version` shows 3.13+ (or 3.14 like on some distros), you need an alternate Python
to create the venv.

Option A: `pyenv` (recommended if you don’t already use conda)

```bash
# one-time: install pyenv (see https://github.com/pyenv/pyenv for prerequisites)

cd backend
pyenv install 3.12.7
pyenv local 3.12.7

python -m venv .venv
source .venv/bin/activate
pip install -U pip
pip install -e .
```

Option B: `conda`

```bash
conda create -n ecostream-backend python=3.12 -y
conda activate ecostream-backend

cd backend
pip install -U pip
pip install -e .
```

Option C: `uv` (no sudo, fastest to bootstrap)

```bash
cd backend

# Install uv into ~/.local/bin
curl -LsSf https://astral.sh/uv/install.sh | sh
export PATH="$HOME/.local/bin:$PATH"

# Install Python 3.12 and create a venv with pip included
uv python install 3.12
uv venv .venv --python 3.12 --seed

source .venv/bin/activate
pip install -U pip
pip install -e .
```

Note: you *can* try Python 3.13+ by changing `requires-python`, but Pathway / xPack wheels may not
be available for those versions yet, so installs can fail.

Pathway note: if you have a Pathway license/API key for xPack features, set
`PATHWAY_LICENSE_KEY` (see [.env.example](.env.example)).
This is separate from any local model configuration.

If your license is provided as `PATHWAY_API_KEY`, that works too.

Safe local setup options:

```bash
# Option A: export in your shell (recommended for quick runs)
export PATHWAY_LICENSE_KEY="<your_key_here>"

# Option B: put it in backend/.env (gitignored) and load it into your shell
printf '%s\n' 'PATHWAY_LICENSE_KEY=<your_key_here>' > .env
set -a && source .env && set +a
```

## Run: Telemetry + Alerts API

```bash
cd backend
.venv/bin/python -m uvicorn app.server:app --host 0.0.0.0 --port 8780
```

- Fleet: `GET http://localhost:8780/api/fleet`
- Alerts: `GET http://localhost:8780/api/alerts`

## Diagnose endpoint (RAG if available, otherwise DocumentStore)

If the RAG service is running (below), the FastAPI endpoint `POST /api/diagnose`
will proxy the question to it.

If the RAG service is not running, the API falls back to **Pathway DocumentStore** retrieval
and returns deterministic troubleshooting steps plus relevant manual snippets.

Example:

```bash
curl -X POST http://localhost:8780/api/diagnose \
  -H "Content-Type: application/json" \
  -d '{"unit_id":"ECO-102","question":"Motor temperature spiked—what should I check first?"}'
```

## Frontend integration (Vite)

The Vite dev server is configured to proxy `/api/*` to `http://127.0.0.1:8780`.

Run everything in 3 terminals:

```bash
# Terminal A (DocumentStore)
cd backend
.venv/bin/python docstore_service.py
```

```bash
# Terminal B (API + Pathway pipeline)
cd backend
.venv/bin/python -m uvicorn app.server:app --host 0.0.0.0 --port 8780
```

```bash
# Terminal C (Frontend)
cd ..
npm run dev
```

## CORS (if you don’t use the proxy)

If you run the frontend without the proxy (or from a different host), set:

```bash
export ECOSTREAM_CORS_ORIGINS="http://localhost:5173,http://127.0.0.1:5173"
```

## Slimming the Python 3.12 venv

If you previously installed `pathway[xpack-llm-docs]`, your venv likely includes large optional
packages (e.g. `docling`, OCR stacks, and sometimes `torch`). The backend now defaults to
`pathway[xpack-llm]==0.29.1` only.

Because pip won’t auto-uninstall removed dependencies, the cleanest way to slim down is to
recreate the venv:

```bash
cd backend
deactivate 2>/dev/null || true
rm -rf .venv

# recreate (pick one)
python3.12 -m venv .venv
# or: uv venv .venv --python 3.12 --seed

source .venv/bin/activate
pip install -U pip
pip install -e .
```

If you do want full document parsing (PDF/Office + OCR), install the docs extra explicitly:

```bash
pip install -U "pathway[xpack-llm-docs]==0.29.1"
```

## Run: DocumentStore (retrieval-only)

```bash
cd backend
.venv/bin/python docstore_service.py
```

Then query:

```bash
curl -X POST http://127.0.0.1:8765/v1/retrieve \
  -H "Content-Type: application/json" \
  -d '{"query":"motor temperature spike", "k": 3}'
```

## Run: RAG server (optional)

This runs a Pathway HTTP service (default `http://localhost:8766`). It is designed to work
without external provider keys by using a local HuggingFace pipeline model.

```bash
cd backend
export ECOSTREAM_HF_MODEL=gpt2
export ECOSTREAM_HF_DEVICE=cpu   # or cuda:0
export ECOSTREAM_HF_MAX_NEW_TOKENS=256
.venv/bin/python rag_service.py
```

If model loading fails, you likely need to install local LLM dependencies appropriate for your machine
(commonly `transformers` + `torch`).

