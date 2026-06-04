# StreamKar Training Bot 🤖

An AI-powered chatbot for the [StreamKar](https://streamkar.com) live streaming platform. Features **two backend engines** and a unified React frontend.

---

## 🐳 Quick Start (Docker) — Recommended

```bash
# 1. Set up your API key
cp .env.example .env
# Edit .env → paste your OpenAI API key

# 2. Run
docker-compose up --build
```

Open **http://localhost:3000** — done! ✅

To stop: `Ctrl+C` or `docker-compose down`

> **💡 No OpenAI API key?** No problem! The **TF-IDF Engine** works 100% offline — no API key, no internet needed. Just skip step 1 (create an empty `.env` file) and select **"TF-IDF Engine"** on the mode selector screen. Only the RAG mode requires an OpenAI key.

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

### Backend Setup
```bash
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

# Start RAG backend (port 8000)
python main.py

# Start TF-IDF backend (port 8001) — in a new terminal
python main_tfidf.py
```

### Frontend Setup
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
├── Dockerfile                  # Python backend image
├── .env.example                # Environment template
├── .env                        # Your API keys (git-ignored)
│
├── main.py                     # 🧠 RAG Backend (port 8000)
├── main_tfidf.py               # ⚡ TF-IDF Backend (port 8001)
├── faqs.json                   # Knowledge base (40 FAQs)
├── requirements.txt            # Python dependencies
│
├── frontend/
│   ├── Dockerfile              # React build + nginx
│   ├── nginx.conf              # API proxy config
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── App.jsx             # Mode selector + chat routing
│       └── components/
│           ├── ModeSelector.jsx
│           ├── ChatHeader.jsx
│           ├── ChatMessages.jsx
│           ├── MessageBubble.jsx
│           ├── ChatInput.jsx
│           ├── SuggestionChips.jsx
│           ├── TypingIndicator.jsx
│           └── InfoModal.jsx
│
└── static/                     # Fallback HTML (TF-IDF standalone)
    └── index.html
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

### `GET /faqs` — List All FAQs
### `GET /health` — Health Check
### `GET /docs` — Swagger UI

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
