# 🌍 EcoStream Dispatch

**AI-Led Climate Action for Indian Logistics | Built for Hack For Green Bharat 2026**

![Pathway](https://img.shields.io/badge/Pathway-Streaming_Engine-00E5FF?style=for-the-badge)
![Python](https://img.shields.io/badge/Python-3.10--3.12-3776AB?style=for-the-badge&logo=python&logoColor=white)
![React](https://img.shields.io/badge/React-UI-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Status](https://img.shields.io/badge/Status-Hackathon_Prototype-success?style=for-the-badge)

> **The Vision:** Transforming Bharat's commercial transport network by replacing stale, batch-processed data with infinite-context, real-time AI to slash carbon emissions.

---

## 🚀 The Spark & The Problem
Observing the heavy industrial corridors in Coimbatore and across India, we realized a massive disconnect: cutting-edge AI exists, yet commercial transport still relies on delayed, batch-processed data. 

A heavy-duty truck idling in highway congestion or running an inefficient route isn't just a logistical loss; it is a massive, preventable source of carbon emissions. Furthermore, traditional Retrieval-Augmented Generation (RAG) stacks relying on external vector databases are simply too slow for live highway telemetry. By the time an LLM analyzes an engine temperature spike using periodic batch processing, the data is already stale, leading to preventable breakdowns and hazardous industrial waste.

## 💡 Our Solution: Continuous Learning
EcoStream Dispatch completely bypasses this limitation. We built a real-time event-driven architecture that operates with zero latency. 

By utilizing **Pathway's real-time streaming engine**, our vector index lives *natively inside the live data pipeline*. We process high-frequency IoT telemetry natively to actively prevent carbon emissions and fleet breakdowns, rather than just reporting on them after the fact.

---

## ✨ Key Features & "Green" Impact

* **Live Telemetry Ingestion:** Utilizes Pathway's Python connectors to ingest continuous streams of GPS coordinates, engine temperatures, and load-status signals from commercial fleets.
* **Continuous RAG Diagnostics:** Ingests high-frequency IoT telemetry and cross-references it against indexed technical vehicle manuals on the fly. 
* **Autonomous Rerouting:** The system doesn't just send an alert—it instantly outputs exact troubleshooting steps and rerouting coordinates to prevent fleet breakdowns.
* **Measurable Climate Action:** Directly reduces commercial fuel consumption and idle times, minimizing the logistics industry's carbon footprint.

---

## 🛠️ Tech Stack: Exploiting Pathway

* **Core Engine:** [Pathway](https://pathway.com/) (Stateful streaming, incremental computation)
* **LLM Integration:** Pathway LLM xPack (Live RAG, Document Store)
* **Backend:** Python 3
* **Frontend Dashboard:** React, Tailwind CSS, Lucide Icons
* **Data Streams:** Simulated Kafka/MQTT telemetry streams

---

## 📸 System Architecture & UI

<img width="1600" height="805" alt="image" src="https://github.com/user-attachments/assets/74fcc217-a5cd-448c-815a-47e3cf634d75" />

The frontend features a dark-mode command center providing live fleet telemetry, real-time (including geospatial) anomaly detection, and a dedicated diagnostics console powered by Pathway DocumentStore / optional RAG.

---

## 💻 How to Run Locally

### Prerequisites

- **Node.js**: 18+ (recommended: 20+)
- **Python**: 3.10–3.12 (recommended: 3.12)

If your system Python is 3.13/3.14, create the backend venv with Python 3.12 (example below).

### 1. Clone the Repository
```bash
git clone https://github.com/ADITHYAPAI13/EcoStream-Dispatch-Pathway.git
cd EcoStream-Dispatch-Pathway
```

### 2. Install dependencies

Frontend (run from the **repo root**, not from `backend/`):

```bash
npm install
```

Backend (Python package in `backend/`):

```bash
cd backend

# Recommended: uv (installs Python 3.12 for you + creates the venv)
curl -LsSf https://astral.sh/uv/install.sh | sh
export PATH="$HOME/.local/bin:$PATH"
uv python install 3.12
uv venv .venv --python 3.12 --seed

.venv/bin/python -m pip install -U pip
.venv/bin/python -m pip install -e .

cd ..
```

If Pathway/xPack features require a key in your environment, export it before starting services:

```bash
export PATHWAY_LICENSE_KEY="<your_key_here>"
```

## Structure

```text
src/
	components/        # reusable UI pieces (modals, etc.)
	data/              # mock/demo data + helpers
	hooks/             # custom React hooks
	layout/            # app shell / layout chrome
	pages/             # route-level screens
	routes/            # router composition / guards
	App.jsx            # app state (auth) + route wiring
	main.jsx           # React entrypoint
```

## Run (Backend + Pathway services + Frontend)

Run everything in 3 terminals.

### Note on `lib64` inside the venv (Linux)

In `backend/.venv`, it’s normal to see both `lib/` and `lib64/`. On most Linux systems
`lib64` is just a symlink to `lib` (compatibility for 64-bit layouts), so packages are **not**
installed twice.

### 1) Start DocumentStore (8765)

```bash
cd backend
.venv/bin/python docstore_service.py
```

### 2) Start FastAPI + Pathway pipeline (8780)

```bash
cd backend
.venv/bin/python -m uvicorn app.server:app --host 0.0.0.0 --port 8780
```

### 3) Start Frontend (5173)

The Vite dev server proxies `/api/*` to `http://127.0.0.1:8780`, so the frontend can simply `fetch('/api/fleet')`.

```bash
cd ..
npm run dev
```

Then open the URL printed in the terminal (usually `http://localhost:5173`).

Troubleshooting: if you accidentally run `npm run dev` inside `backend/`, stop it and re-run from the repo root.

### Live endpoints

- `GET http://localhost:8780/api/health`
- `GET http://localhost:8780/api/fleet`
- `GET http://localhost:8780/api/alerts`
- `POST http://localhost:8780/api/diagnose`

### More details

- Backend setup, CORS, optional RAG server: see [backend/README.md](backend/README.md)
