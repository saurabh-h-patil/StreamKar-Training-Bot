# StreamKar Training Bot 🤖

An AI-powered chatbot for the [StreamKar](https://streamkar.com) live streaming platform. Features **two backend engines** and a unified React frontend.

---

## 🐳 Quick Start (Docker) — Recommended

```bash
# 1. Set up your API key
cp backend/.env.example backend/.env
# Edit backend/.env → paste your OpenAI API key

# 2. Run
docker-compose up --build
```

Open **http://localhost:3000** — done! ✅

To stop: `Ctrl+C` or `docker-compose down`

> **💡 No OpenAI API key?** No problem! The **TF-IDF Engine** works 100% offline — no API key, no internet needed. Just create an empty `backend/.env` file and select **"TF-IDF Engine"** on the mode selector screen. Only the RAG mode requires an OpenAI key.

---

## 🏗️ Two Backend Engines

### LangChain RAG (AI-Powered)
- OpenAI GPT-4o-mini for natural responses
- ChromaDB vector store for semantic search
- Auto spell-correction before lookup
- **Requires:** OpenAI API key, internet

### TF-IDF Engine (Zero-Config)
- scikit-learn TF-IDF + Cosine Similarity
- Custom stop-words filter for accurate matching
- Two-stage matching (direct + keyword-based)
- **Requires:** Nothing — works 100% offline

The frontend lets you **switch between engines** with one click.

---

## 🔧 Manual Setup (Without Docker)

### Backend
```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate it
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set up environment
cp .env.example .env
# Edit .env with your OpenAI API key

# Start RAG backend (port 5000)
python main.py

# Start TF-IDF backend (port 5001) — in a new terminal
python main_tfidf.py
```

### Frontend
```bash
cd frontend
npm install
npm run dev
# → http://localhost:3000
```

---

## 📁 Project Structure

```
StreamKar/
├── docker-compose.yml          # 🐳 One-command launch
├── Dockerfile                  # Multi-stage build
├── .gitignore
│
├── backend/                    # 🐍 Python backends
│   ├── main.py                 # 🧠 RAG Backend (port 5000)
│   ├── main_tfidf.py           # ⚡ TF-IDF Backend (port 5001)
│   ├── faqs.json               # Knowledge base (40 FAQs)
│   ├── requirements.txt        # Python dependencies
│   ├── .env.example            # Environment template
│   └── .env                    # Your API key (git-ignored)
│
└── frontend/                   # ⚛️ React frontend
    ├── nginx.conf              # Production proxy config
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── App.jsx
        └── components/
            ├── ModeSelector.jsx
            ├── ChatHeader.jsx
            ├── ChatMessages.jsx
            ├── MessageBubble.jsx
            ├── ChatInput.jsx
            ├── SuggestionChips.jsx
            ├── TypingIndicator.jsx
            └── InfoModal.jsx
```

---

## 🔌 API Endpoints

### `POST /ask` — Ask a Question
```json
{ "question": "How do I earn money on StreamKar?" }
```

### `POST /add_faq` — Add a New FAQ
```json
{ "question": "What is XYZ?", "answer": "XYZ is..." }
```

> **⚠️ Note:** Since we have two different backend approaches (RAG and TF-IDF), you need to send the `/add_faq` request to **both** backends so the new FAQ is available on both engines. Don't forget to change the port for each:

```bash
# Add FAQ to RAG Backend (port 5000)
curl -X POST http://localhost:5000/add_faq -H "Content-Type: application/json" -d "{\"question\": \"What is XYZ?\", \"answer\": \"XYZ is...\"}"

# Add FAQ to TF-IDF Backend (port 5001)
curl -X POST http://localhost:5001/add_faq -H "Content-Type: application/json" -d "{\"question\": \"What is XYZ?\", \"answer\": \"XYZ is...\"}"
```

> **💡 Why not port 8000?** The port was changed from `8000` (as in the original Postman collection) to `5000` and `5001` because we have other projects already running on the EC2 server that use port 8000. So we used different ports to avoid conflicts.

### `GET /faqs` — List All FAQs
### `GET /health` — Health Check
### `GET /docs` — Swagger UI

---

## 🧪 Testing with Postman

1. Import `streamkar.postman_collection (2).json`
2. Start both backends
3. Change the port in the request URL from `8000` to `5000` (RAG) or `5001` (TF-IDF)
4. Test `POST /add_faq` and `POST /ask`

---

## 🔌 Ports

| Port | Service | Description |
|------|---------|-------------|
| `3000` | Nginx (Frontend) | Main entry point — serves the React UI and proxies API requests to the backends |
| `5000` | RAG Backend | LangChain + OpenAI powered Q&A engine (internal, proxied via `/api/rag/`) |
| `5001` | TF-IDF Backend | Offline TF-IDF powered Q&A engine (internal, proxied via `/api/tfidf/`) |

> **Note:** In Docker mode, only port **3000** is exposed to the host. Ports 5000 and 5001 run internally inside the container and are reverse-proxied by Nginx.

---

## 🧪 Testing with Postman

1. Import `streamkar.postman_collection (2).json`
2. Start either backend
3. Test `POST /add_faq` and `POST /ask`

---

## 📚 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js, Tailwind CSS, Vite |
| RAG Backend | FastAPI, LangChain, OpenAI, ChromaDB |
| TF-IDF Backend | FastAPI, scikit-learn |
| Deployment | Docker, Docker Compose, Nginx |

---

## 📝 Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `OPENAI_API_KEY` | RAG only | — | Your OpenAI API key |
| `OPENAI_MODEL` | No | `gpt-4o-mini` | LLM model name |
| `OPENAI_EMBEDDING_MODEL` | No | `text-embedding-3-small` | Embedding model |

---

Built by Saurabh — StreamKar Training Bot Assignment
