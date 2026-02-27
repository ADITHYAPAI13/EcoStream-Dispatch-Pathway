# 🌍 EcoStream Dispatch

**AI-Led Climate Action for Indian Logistics | Built for Hack For Green Bharat 2026**

![Pathway](https://img.shields.io/badge/Pathway-Streaming_Engine-00E5FF?style=for-the-badge)
![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)
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

![EcoStream Command Center] <img width="1600" height="805" alt="image" src="https://github.com/user-attachments/assets/74fcc217-a5cd-448c-815a-47e3cf634d75" />


The frontend features a dark-mode command center providing live fleet telemetry, real-time geospatial anomaly detection, and a dedicated LLM Diagnostics terminal for RAG-powered repair protocols.

---

## 💻 How to Run Locally

### 1. Clone the Repository
```bash
git clone [https://github.com/yourusername/ecostream-dispatch.git](https://github.com/yourusername/ecostream-dispatch.git)
cd ecostream-dispatch

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

## Run

```bash
npm install
npm run dev
```

Then open the URL printed in the terminal (usually `http://localhost:5173`).
