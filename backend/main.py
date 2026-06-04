"""
StreamKar Training Bot — FastAPI Backend with LangChain RAG Pipeline
=====================================================================
A domain-specific chatbot for StreamKar (streamkar.com) that uses
LangChain's Retrieval-Augmented Generation (RAG) to answer user questions.

Architecture:
    - LangChain for orchestration (LCEL chain)
    - ChromaDB as the vector store
    - OpenAI Embeddings (text-embedding-3-small)
    - OpenAI GPT-4o-mini as the LLM
    - Pre-loaded FAQ knowledge base from faqs.json

Endpoints:
    POST /add_faq  — Add a new FAQ to the knowledge base
    POST /ask      — Ask a question via LangChain RAG pipeline
    GET  /faqs     — List all stored FAQs
    GET  /health   — Health check
"""

import json
import os
import uuid
from pathlib import Path
from typing import Optional

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

# LangChain imports
from langchain_core.documents import Document
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from langchain_chroma import Chroma
from langchain_openai import OpenAIEmbeddings, ChatOpenAI

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------
load_dotenv()

BASE_DIR = Path(__file__).resolve().parent
FAQS_FILE = BASE_DIR / "faqs.json"
CHROMA_DIR = str(BASE_DIR / "chroma_db")
COLLECTION_NAME = "streamkar_faqs"
SIMILARITY_THRESHOLD = 0.15
TOP_K = 4

# OpenAI API
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")

if not OPENAI_API_KEY:
    print("❌ ERROR: No OPENAI_API_KEY found in .env file!")
    print("   Add your key: OPENAI_API_KEY=sk-...")
    exit(1)


def get_vectorstore_count(vs):
    """Safely get document count from vectorstore across chromadb versions."""
    try:
        return len(vs.get()["ids"])
    except Exception:
        try:
            return vs._collection.count()
        except Exception:
            return 0


# ---------------------------------------------------------------------------
# Initialize LangChain Components
# ---------------------------------------------------------------------------

# 1. Embeddings — OpenAI
print("🔄 Initializing OpenAI Embeddings...")
embeddings = OpenAIEmbeddings(
    model="text-embedding-3-small",
    openai_api_key=OPENAI_API_KEY,
)
print("✅ OpenAI Embeddings ready")

# 2. Vector Store — ChromaDB
vectorstore = Chroma(
    collection_name=COLLECTION_NAME,
    embedding_function=embeddings,
    persist_directory=CHROMA_DIR,
)

# 3. LLM — OpenAI GPT-4o-mini
print("🔄 Initializing OpenAI LLM...")
llm = ChatOpenAI(
    model="gpt-4o-mini",
    openai_api_key=OPENAI_API_KEY,
    temperature=0.3,
    max_tokens=1024,
)
print("✅ OpenAI GPT-4o-mini ready")

# 4. RAG Prompt Template
rag_prompt = ChatPromptTemplate.from_template(
    """You are a friendly and helpful customer support assistant for StreamKar, 
a popular live streaming mobile application in India. Your name is StreamKar Bot.

Use ONLY the following context from our knowledge base to answer the user's question.
Synthesize a natural, helpful, and conversational response.
If the context doesn't contain enough information, politely say you don't have that 
specific information and suggest contacting StreamKar support at complaints@streamkar.com.

Rules:
- Do NOT make up information that isn't in the context
- Keep responses concise but helpful (2-4 paragraphs max)
- Use bullet points or numbered lists when listing steps or features
- Be warm, encouraging, and professional

Context from Knowledge Base:
{context}

User's Question: {question}

Helpful Answer:"""
)

# 5. Retriever
retriever = vectorstore.as_retriever(
    search_type="similarity",
    search_kwargs={"k": TOP_K},
)


def format_docs(docs):
    """Format retrieved documents into a single context string."""
    return "\n\n".join(
        f"Q: {doc.metadata.get('question', '')}\nA: {doc.metadata.get('answer', '')}"
        for doc in docs
    )


# 6. LCEL RAG Chain (modern LangChain approach)
rag_chain = (
    {"context": retriever | format_docs, "question": RunnablePassthrough()}
    | rag_prompt
    | llm
    | StrOutputParser()
)
print("✅ LangChain LCEL RAG chain initialized")

# ---------------------------------------------------------------------------
# Load Pre-built FAQs into ChromaDB
# ---------------------------------------------------------------------------

def load_initial_faqs():
    """Load FAQs from faqs.json into ChromaDB if the collection is empty."""
    existing_count = get_vectorstore_count(vectorstore)
    if existing_count > 0:
        print(f"✅ ChromaDB already has {existing_count} FAQs loaded")
        return

    if not FAQS_FILE.exists():
        print("⚠️  faqs.json not found — starting with empty knowledge base")
        return

    with open(FAQS_FILE, "r", encoding="utf-8") as f:
        faqs = json.load(f)

    if not faqs:
        return

    documents = []
    for i, faq in enumerate(faqs):
        doc = Document(
            page_content=f"Question: {faq['question']}\nAnswer: {faq['answer']}",
            metadata={
                "question": faq["question"],
                "answer": faq["answer"],
                "source": "preloaded",
                "faq_id": f"faq_{i}",
            },
        )
        documents.append(doc)

    vectorstore.add_documents(documents)
    print(f"✅ Loaded {len(faqs)} FAQs into ChromaDB via OpenAI Embeddings")


load_initial_faqs()

# ---------------------------------------------------------------------------
# FastAPI Application
# ---------------------------------------------------------------------------
app = FastAPI(
    title="StreamKar Training Bot",
    description="A LangChain RAG-powered chatbot for StreamKar (OpenAI)",
    version="2.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

react_build_dir = BASE_DIR / "frontend" / "dist"
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
    source: str = "rag"

# ---------------------------------------------------------------------------
# API Endpoints
# ---------------------------------------------------------------------------

@app.get("/")
async def serve_frontend():
    """Serve the React frontend (production build)."""
    index_path = react_build_dir / "index.html"
    if index_path.exists():
        return FileResponse(str(index_path))
    return {
        "message": "StreamKar Training Bot API is running!",
        "docs": "Visit /docs for API documentation",
        "endpoints": {
            "POST /add_faq": "Add a new FAQ",
            "POST /ask": "Ask a question",
            "GET /faqs": "List all FAQs",
            "GET /health": "Health check",
        },
    }


@app.post("/add_faq")
async def add_faq(faq: FAQInput):
    """Add a new FAQ to the knowledge base (matches Postman collection)."""
    if not faq.question.strip() or not faq.answer.strip():
        raise HTTPException(status_code=400, detail="Question and answer cannot be empty")

    doc = Document(
        page_content=f"Question: {faq.question}\nAnswer: {faq.answer}",
        metadata={
            "question": faq.question,
            "answer": faq.answer,
            "source": "user_added",
            "faq_id": f"faq_custom_{uuid.uuid4().hex[:8]}",
        },
    )
    vectorstore.add_documents([doc])

    faqs = []
    if FAQS_FILE.exists():
        with open(FAQS_FILE, "r", encoding="utf-8") as f:
            faqs = json.load(f)
    faqs.append({"question": faq.question, "answer": faq.answer})
    with open(FAQS_FILE, "w", encoding="utf-8") as f:
        json.dump(faqs, f, indent=2, ensure_ascii=False)

    current_count = get_vectorstore_count(vectorstore)
    return {
        "status": "success",
        "message": f"FAQ added successfully. Knowledge base now has {current_count} entries.",
    }


@app.post("/ask", response_model=AskResponse)
async def ask_question(query: AskInput):
    """Ask a question — uses LangChain LCEL RAG chain with spell correction."""
    if not query.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty")

    original_question = query.question.strip()

    # Step 1: Auto-correct spelling/grammar using OpenAI (handles typos)
    try:
        correction_response = llm.invoke(
            f"Fix any spelling and grammar errors in this question. "
            f"Return ONLY the corrected question, nothing else. "
            f"If the question is already correct, return it as-is.\n\n"
            f"Question: {original_question}"
        )
        corrected_question = correction_response.content.strip()
        if corrected_question:
            print(f"📝 Query correction: '{original_question}' → '{corrected_question}'")
        else:
            corrected_question = original_question
    except Exception:
        corrected_question = original_question

    # Step 2: Similarity search with the corrected query
    docs_with_scores = vectorstore.similarity_search_with_relevance_scores(
        corrected_question, k=TOP_K
    )

    if not docs_with_scores or docs_with_scores[0][1] < SIMILARITY_THRESHOLD:
        return AskResponse(
            answer="I'm sorry, I don't have specific information about that yet. "
                   "You can try asking about StreamKar's features, how to earn money, "
                   "gifts, VIP memberships, PK matches, or safety features. "
                   "For specific account issues, please contact StreamKar support.",
            source="fallback",
        )

    best_doc, best_score = docs_with_scores[0]
    matched_question = best_doc.metadata.get("question", "")

    # Step 3: Generate answer using LangChain LCEL RAG chain
    try:
        answer = rag_chain.invoke(corrected_question)
        return AskResponse(
            answer=answer,
            matched_question=matched_question,
            confidence=round(best_score, 4),
            source="langchain_rag",
        )
    except Exception as e:
        print(f"⚠️  RAG chain error: {e}")
        return AskResponse(
            answer=best_doc.metadata.get("answer", "Sorry, something went wrong."),
            matched_question=matched_question,
            confidence=round(best_score, 4),
            source="retrieval",
        )


@app.get("/faqs")
async def list_faqs():
    """List all FAQs in the knowledge base."""
    try:
        all_docs = vectorstore.get()
    except Exception:
        all_docs = {"metadatas": [], "ids": []}
    faqs = []
    for metadata in (all_docs.get("metadatas") or []):
        if metadata:
            faqs.append({
                "question": metadata.get("question", ""),
                "answer": metadata.get("answer", ""),
                "source": metadata.get("source", "unknown"),
            })
    return {"total": len(faqs), "faqs": faqs}


@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "faq_count": get_vectorstore_count(vectorstore),
        "llm": "OpenAI GPT-4o-mini",
        "embeddings": "OpenAI text-embedding-3-small",
        "chain": "LangChain LCEL RAG",
        "vector_store": "ChromaDB",
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)
