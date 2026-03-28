# SafeLayer — AI Safety & Monitoring Platform

Real-time AI output safety monitoring, risk scoring, filtering, and compliance.
Built on a **100% free / open-source** tech stack.

---

## Project Structure

```
safelayer/
├── frontend/
│   ├── index.html                  ← Main HTML entry point
│   ├── components/
│   │   └── SafetyChecker.jsx       ← React interactive widget
│   ├── css/
│   │   ├── reset.css               ← Box-model & normalize baseline
│   │   ├── variables.css           ← Design tokens (colors, spacing, fonts)
│   │   ├── layout.css              ← Page structure, grids, sections
│   │   ├── components.css          ← UI components (nav, cards, modal…)
│   │   ├── animations.css          ← Keyframes & scroll-reveal utilities
│   │   └── responsive.css          ← Breakpoints & mobile overrides
│   └── js/
│       ├── data.js                 ← Single source of truth for all content
│       ├── diagram.js              ← Hero SVG architecture diagram (injected)
│       ├── stats.js                ← Stats bar renderer
│       ├── cards.js                ← Split, feature, roadmap card renderer
│       ├── architecture.js         ← Architecture pipeline node renderer
│       ├── stack.js                ← Tech stack grid renderer
│       ├── timeline.js             ← MVP timeline renderer
│       ├── pricing.js              ← Pricing cards renderer
│       ├── modal.js                ← Early-access modal (open/close/submit)
│       └── main.js                 ← Bootstrap: scroll-reveal, navbar, smooth-scroll
│
└── backend/
    ├── requirements.txt            ← Python dependencies
    ├── .env.example                ← Environment variable template
    └── app/
        ├── main.py                 ← FastAPI app, CORS, router mounting
        ├── models/
        │   ├── database.py         ← SQLAlchemy async engine + get_db()
        │   ├── output_log.py       ← OutputLog ORM model
        │   └── waitlist_entry.py   ← WaitlistEntry ORM model
        ├── services/
        │   ├── safety_engine.py    ← Core risk pipeline (regex → spaCy → Detoxify)
        │   └── ollama_service.py   ← Ollama HTTP API wrapper
        ├── routers/
        │   ├── health.py           ← GET  /api/health
        │   ├── safety.py           ← POST /api/safety/check, GET /api/safety/logs
        │   ├── analytics.py        ← GET  /api/analytics/summary & /trend
        │   └── waitlist.py         ← POST /api/waitlist, GET /api/waitlist
        └── tests/
            └── test_safety_engine.py ← Pytest unit tests
```

---

## Tech Stack (100% Free)

| Layer       | Technology                         |
|-------------|----------------------------------- |
| AI Model    | Ollama — Mistral / LLaMA           |
| Backend     | FastAPI + Python                   |
| Frontend    | Vanilla HTML/CSS/JS + React.jsx    |
| Database    | PostgreSQL (asyncpg)               |
| Vector DB   | ChromaDB / FAISS                   |
| Safety NLP  | Detoxify + spaCy + Regex           |
| Hosting     | Render (free tier) + Vercel        |
| Auth        | JWT (python-jose)                  |
| Monitoring  | Grafana + Prometheus               |
| Queue       | Redis + Celery                     |
| Automation  | n8n                                |

---

## Quick Start

### 1. Clone & install

```bash
git clone https://github.com/your-org/safelayer
cd safelayer
```

### 2. Backend setup

```bash
cd backend
python -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate

pip install -r requirements.txt
python -m spacy download en_core_web_sm

cp ../.env.example .env            # edit .env with your DB / Redis URLs
```

### 3. Start Ollama

```bash
# Install from https://ollama.com
ollama pull mistral
ollama serve
```

### 4. Start PostgreSQL & create database

```bash
createdb safelayer
```

### 5. Run the API

```bash
uvicorn app.main:app --reload --port 8000
# Swagger docs → http://localhost:8000/api/docs
```

### 6. Open the frontend

Open `frontend/index.html` directly in a browser.
For React component development:

```bash
# Using Vite
npm create vite@latest safelayer-react -- --template react
# Copy frontend/components/SafetyChecker.jsx into src/components/
```

### 7. Run tests

```bash
pytest tests/ -v
```

---

## API Endpoints

| Method | Path                       | Description                        |
|--------|----------------------------|------------------------------------|
| GET    | /api/health                | Service health + Ollama model list |
| POST   | /api/safety/check          | Check AI output safety             |
| GET    | /api/safety/logs           | Paginated output log history       |
| GET    | /api/analytics/summary     | Risk distribution totals           |
| GET    | /api/analytics/trend       | Daily counts (last N days)         |
| POST   | /api/waitlist              | Join early-access waitlist         |
| GET    | /api/waitlist              | List all waitlist entries (admin)  |

---

## License

MIT — free to use, modify, and deploy.
