import React, { useEffect, useCallback } from "react";

const PIPELINE = {
  rag: [
    { icon: "✏️", label: "Spell Fix" },
    { icon: "🔢", label: "Embed" },
    { icon: "🔍", label: "Vector Search" },
    { icon: "🧠", label: "GPT-4o-mini" },
  ],
  tfidf: [
    { icon: "📐", label: "Tokenize" },
    { icon: "📊", label: "TF-IDF" },
    { icon: "📏", label: "Cosine Sim" },
    { icon: "✅", label: "Best Match" },
  ],
};

const STACK = {
  rag: ["LangChain", "OpenAI", "ChromaDB", "FastAPI", "React", "Tailwind"],
  tfidf: ["scikit-learn", "TF-IDF", "Cosine Similarity", "FastAPI", "React", "Tailwind"],
};

function InfoModal({ isOpen, onClose, mode }) {
  const onKey = useCallback((e) => { if (e.key === "Escape") onClose(); }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", onKey);
      return () => document.removeEventListener("keydown", onKey);
    }
  }, [isOpen, onKey]);

  const steps = PIPELINE[mode] || PIPELINE.rag;
  const stack = STACK[mode] || STACK.rag;
  const title = mode === "rag" ? "RAG Pipeline" : "TF-IDF Pipeline";

  return (
    <div
      className={`fixed inset-0 z-[1000] flex items-center justify-center transition-all duration-300 ${
        isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className={`relative bg-[#12121C] border border-white/[0.06] rounded-2xl p-6 w-[92%] max-w-[440px] max-h-[80vh] overflow-y-auto transition-all duration-400 ${
        isOpen ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
      }`} style={{ transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)" }}>

        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-white/90">{title}</h2>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg text-[#5E5E75] hover:text-white/70 hover:bg-white/[0.05] transition-all text-sm">✕</button>
        </div>

        {/* Pipeline */}
        <div className="flex items-center justify-between gap-1 p-4 bg-white/[0.02] border border-white/[0.04] rounded-xl mb-4">
          {steps.map((s, i) => (
            <React.Fragment key={s.label}>
              <div className="flex flex-col items-center gap-1.5 min-w-[48px]">
                <span className="text-lg">{s.icon}</span>
                <span className="text-[0.58rem] text-[#6E6E88] text-center leading-tight">{s.label}</span>
              </div>
              {i < steps.length - 1 && <span className="text-[#3A3A50] text-xs">→</span>}
            </React.Fragment>
          ))}
        </div>

        {/* Tech Stack */}
        <div className="p-4 bg-white/[0.02] border border-white/[0.04] rounded-xl">
          <p className="text-[0.75rem] font-semibold text-white/70 mb-3">Tech Stack</p>
          <div className="flex flex-wrap gap-1.5">
            {stack.map((t) => (
              <span key={t} className="px-3 py-1 text-[0.68rem] font-medium text-[#9E9EB8] bg-white/[0.03] border border-white/[0.05] rounded-full">{t}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(InfoModal);
