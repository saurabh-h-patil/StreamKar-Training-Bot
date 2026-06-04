"""
StreamKar Training Bot — TF-IDF Backend (Zero-Config)
======================================================
A lightweight, zero-dependency chatbot for StreamKar that uses
TF-IDF + Cosine Similarity for FAQ matching.

Why TF-IDF:
    - Zero-config: pip install + uvicorn main_tfidf:app = done
    - No API keys, no internet, no GPU needed
    - Instant /add_faq — appends to TF-IDF matrix with zero latency
    - Perfect Postman alignment

Run:
    uvicorn main_tfidf:app --reload --port 5001

Endpoints:
    POST /add_faq  — Add a new FAQ (matches Postman collection)
    POST /ask      — Ask a question via TF-IDF similarity
    GET  /faqs     — List all stored FAQs
    GET  /health   — Health check
"""

import json
import re
from pathlib import Path
from typing import Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, HTMLResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------
BASE_DIR = Path(__file__).resolve().parent
FAQS_FILE = BASE_DIR / "faqs.json"
SIMILARITY_THRESHOLD = 0.15   # Minimum cosine similarity for a match
TOP_K = 3                     # Top matches to consider

# ---------------------------------------------------------------------------
# FAQ Store (in-memory + JSON file persistence)
# ---------------------------------------------------------------------------
faqs_data: list[dict] = []

# Custom stop words: strips conversational/question-structure filler
# so TF-IDF focuses ONLY on content keywords
CUSTOM_STOP_WORDS = [
    # Question structure words
    "what", "is", "the", "how", "do", "i", "can", "you", "does", "did",
    "are", "was", "were", "will", "would", "could", "should", "may", "might",
    # Articles / prepositions / conjunctions
    "a", "an", "of", "to", "on", "for", "with", "about", "through", "from",
    "in", "at", "by", "and", "or", "but", "not", "no", "if", "then",
    # Pronouns / misc filler
    "there", "available", "me", "my", "your", "this", "that", "it", "its",
    "they", "them", "their", "we", "our", "be", "been", "being", "have", "has",
    "had", "get", "got", "give", "tell", "please", "help", "need", "want",
]

vectorizer = TfidfVectorizer(
    stop_words=CUSTOM_STOP_WORDS,
    lowercase=True,
    sublinear_tf=True,
)
tfidf_matrix = None


def preprocess_text(text: str) -> str:
    """Normalize text for better matching."""
    text = text.lower().strip()
    text = re.sub(r"[^\w\s]", " ", text)   # Remove punctuation
    text = re.sub(r"\s+", " ", text)        # Collapse whitespace
    return text


def load_faqs():
    """Load FAQs from faqs.json."""
    global faqs_data
    if FAQS_FILE.exists():
        with open(FAQS_FILE, "r", encoding="utf-8") as f:
            faqs_data = json.load(f)
        print(f"✅ Loaded {len(faqs_data)} FAQs from faqs.json")
    else:
        print("⚠️  faqs.json not found — starting with empty knowledge base")
        faqs_data = []


def rebuild_tfidf():
    """Rebuild the TF-IDF matrix from FAQ questions only."""
    global tfidf_matrix
    if not faqs_data:
        tfidf_matrix = None
        return
    
    # Match against questions only (not answers)
    # This prevents common words like 'streamkar' from losing weight
    # since they appear in every FAQ answer
    corpus = [
        preprocess_text(faq["question"])
        for faq in faqs_data
    ]
    tfidf_matrix = vectorizer.fit_transform(corpus)
    print(f"✅ TF-IDF matrix built: {tfidf_matrix.shape[0]} docs × {tfidf_matrix.shape[1]} features")

# Common words to ignore when checking keyword overlap
TRIVIAL_WORDS = {
    "what", "how", "why", "when", "where", "who", "which", "can", "do", "does",
    "is", "are", "was", "were", "the", "a", "an", "in", "on", "of", "to", "for",
    "and", "or", "it", "i", "my", "me", "you", "your", "this", "that", "there",
    "streamkar", "stream", "kar", "please", "tell", "about", "give", "get",
}


def has_keyword_overlap(query: str, faq_question: str) -> bool:
    """Check if query and FAQ question share at least one meaningful keyword."""
    query_words = set(preprocess_text(query).split()) - TRIVIAL_WORDS
    faq_words = set(preprocess_text(faq_question).split()) - TRIVIAL_WORDS
    query_words = {w for w in query_words if len(w) > 2}
    faq_words = {w for w in faq_words if len(w) > 2}
    for qw in query_words:
        for fw in faq_words:
            if qw == fw:                      # Exact match
                return True
            # Prefix/suffix match for stemming (earn→earning, stream→streaming)
            # but NOT arbitrary substring (live inside delivery)
            if len(qw) >= 4 and len(fw) >= 4:
                if fw.startswith(qw) or qw.startswith(fw):
                    return True
    return False


def direct_text_match(query: str, threshold: float = 0.6):
    """
    Stage 1: Direct text similarity using SequenceMatcher.
    Catches queries like 'What is StreamKar?' that TF-IDF struggles with
    because stop words strip away all meaningful tokens.
    Also validates keyword overlap to reject structural-only matches.
    """
    from difflib import SequenceMatcher
    query_clean = preprocess_text(query)
    best_score = 0
    best_idx = -1
    for i, faq in enumerate(faqs_data):
        faq_clean = preprocess_text(faq["question"])
        score = SequenceMatcher(None, query_clean, faq_clean).ratio()
        if score > best_score:
            # For scores below 0.85, require keyword overlap
            # (above 0.85 = near-exact match, always trust it)
            if score >= 0.85 or has_keyword_overlap(query, faq["question"]):
                best_score = score
                best_idx = i
    if best_score >= threshold and best_idx >= 0:
        return {
            "question": faqs_data[best_idx]["question"],
            "answer": faqs_data[best_idx]["answer"],
            "score": round(best_score, 4),
        }
    return None


def find_best_matches(query: str, top_k: int = TOP_K):
    """
    Two-stage FAQ matching:
    Stage 1: Direct text similarity (handles exact/near-exact queries)
    Stage 2: TF-IDF + Cosine Similarity (handles paraphrased queries)
    """
    if len(faqs_data) == 0:
        return []

    # Stage 1: Direct text match (catches "What is StreamKar?" etc.)
    direct = direct_text_match(query)
    if direct:
        return [direct]

    # Stage 2: TF-IDF matching (catches paraphrased/keyword queries)
    if tfidf_matrix is None:
        return []

    processed_query = preprocess_text(query)
    query_vector = vectorizer.transform([processed_query])
    similarities = cosine_similarity(query_vector, tfidf_matrix).flatten()

    top_indices = similarities.argsort()[::-1][:top_k]

    results = []
    for idx in top_indices:
        score = float(similarities[idx])
        if score >= SIMILARITY_THRESHOLD:
            faq_q = faqs_data[idx]["question"]
            if has_keyword_overlap(query, faq_q):
                results.append({
                    "question": faq_q,
                    "answer": faqs_data[idx]["answer"],
                    "score": round(score, 4),
                })

    return results


# Initialize
load_faqs()
rebuild_tfidf()

# ---------------------------------------------------------------------------
# FastAPI Application
# ---------------------------------------------------------------------------
app = FastAPI(
    title="StreamKar Training Bot (TF-IDF)",
    description="A lightweight TF-IDF-powered chatbot for StreamKar",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve React build if available, otherwise serve static HTML
react_build_dir = BASE_DIR / "frontend" / "dist"
static_dir = BASE_DIR / "static"

if react_build_dir.exists():
    app.mount("/assets", StaticFiles(directory=str(react_build_dir / "assets")), name="assets")

# ---------------------------------------------------------------------------
# Pydantic Models
# ---------------------------------------------------------------------------

class FAQInput(BaseModel):
    question: str
    answer: str

class AskInput(BaseModel):
    question: str

class AskResponse(BaseModel):
    answer: str
    matched_question: Optional[str] = None
    confidence: Optional[float] = None
    source: str = "tfidf"

# ---------------------------------------------------------------------------
# API Endpoints
# ---------------------------------------------------------------------------

@app.get("/")
async def serve_frontend():
    """Serve frontend UI."""
    # Try React build first
    react_index = react_build_dir / "index.html"
    if react_index.exists():
        return FileResponse(str(react_index))
    # Fallback to static HTML
    static_index = static_dir / "index.html"
    if static_index.exists():
        return FileResponse(str(static_index))
    return {
        "message": "StreamKar Training Bot (TF-IDF) is running!",
        "docs": "Visit /docs for Swagger API documentation",
        "endpoints": {
            "POST /add_faq": "Add a new FAQ",
            "POST /ask": "Ask a question",
            "GET /faqs": "List all FAQs",
            "GET /health": "Health check",
        },
    }


@app.post("/add_faq")
async def add_faq(faq: FAQInput):
    """
    Add a new FAQ to the knowledge base.
    Matches the Postman collection specification exactly.
    
    Instantly rebuilds the TF-IDF matrix — no network latency,
    no embedding API calls, no waiting.
    """
    if not faq.question.strip() or not faq.answer.strip():
        raise HTTPException(status_code=400, detail="Question and answer cannot be empty")

    # Add to in-memory store
    faqs_data.append({"question": faq.question, "answer": faq.answer})

    # Persist to JSON file
    with open(FAQS_FILE, "w", encoding="utf-8") as f:
        json.dump(faqs_data, f, indent=2, ensure_ascii=False)

    # Instantly rebuild TF-IDF matrix
    rebuild_tfidf()

    return {
        "status": "success",
        "message": f"FAQ added successfully. Knowledge base now has {len(faqs_data)} entries.",
    }


@app.post("/ask", response_model=AskResponse)
async def ask_question(query: AskInput):
    """
    Ask a question about StreamKar using TF-IDF + Cosine Similarity.
    
    Pipeline:
    1. Preprocess the query (lowercase, remove punctuation)
    2. Transform query using TF-IDF vectorizer
    3. Compute cosine similarity against all FAQ vectors
    4. Return the best matching answer
    
    Zero network latency — everything runs locally in-memory.
    """
    if not query.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty")

    matches = find_best_matches(query.question)

    if not matches:
        return AskResponse(
            answer="I'm sorry, I don't have specific information about that yet. "
                   "You can try asking about StreamKar's features, how to earn money, "
                   "gifts, VIP memberships, PK matches, or safety features. "
                   "For specific account issues, please contact StreamKar support at complaints@streamkar.com.",
            source="fallback",
        )

    best = matches[0]
    return AskResponse(
        answer=best["answer"],
        matched_question=best["question"],
        confidence=best["score"],
        source="tfidf",
    )


@app.get("/faqs")
async def list_faqs():
    """List all FAQs in the knowledge base."""
    return {"total": len(faqs_data), "faqs": faqs_data}


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "faq_count": len(faqs_data),
        "algorithm": "TF-IDF + Cosine Similarity",
        "tfidf_features": tfidf_matrix.shape[1] if tfidf_matrix is not None else 0,
        "requires_api_key": False,
        "requires_internet": False,
    }


# ---------------------------------------------------------------------------
# Run: uvicorn main_tfidf:app --reload --port 5001
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5001)

