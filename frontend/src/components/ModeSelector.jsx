import React from "react";

function ModeSelector({ onSelect }) {
  return (
    <div className="flex items-center justify-center min-h-dvh px-5">
      {/* Ambient */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-[15%] left-[20%] w-[420px] h-[420px] rounded-full bg-[#A200BB]/[0.06] blur-[140px]" />
        <div className="absolute bottom-[10%] right-[15%] w-[350px] h-[350px] rounded-full bg-[#FF6B9D]/[0.04] blur-[120px]" />
      </div>

      <div className="w-full max-w-[420px] animate-in">
        {/* Brand */}
        <div className="text-center mb-12">
          <div className="w-[72px] h-[72px] mx-auto rounded-[20px] sk-gradient flex items-center justify-center shadow-[0_12px_48px_rgba(162,0,187,0.35)] mb-6 ring-1 ring-white/10">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              <circle cx="9" cy="10" r="1" fill="white" />
              <circle cx="15" cy="10" r="1" fill="white" />
              <path d="M9 14s1.5 2 3 2 3-2 3-2" />
            </svg>
          </div>
          <h1 className="text-[1.6rem] font-bold text-white tracking-tight mb-1">
            StreamKar Assistant
          </h1>
          <p className="text-sm text-[#7E7E96]">
            Choose how you'd like to chat
          </p>
        </div>

        {/* Options */}
        <div className="space-y-2.5">
          <button
            onClick={() => onSelect("rag")}
            className="group w-full flex items-center gap-4 p-[18px] rounded-2xl border border-white/[0.05] bg-white/[0.02] hover:bg-white/[0.05] hover:border-[#A200BB]/25 transition-all duration-300 active:scale-[0.985]"
          >
            <div className="w-11 h-11 rounded-[14px] sk-gradient flex items-center justify-center shrink-0 shadow-[0_4px_20px_rgba(162,0,187,0.3)] ring-1 ring-white/10">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
            </div>
            <div className="flex-1 text-left">
              <p className="text-[0.9rem] font-semibold text-white/90 group-hover:text-white">LangChain RAG</p>
              <p className="text-[0.72rem] text-[#6E6E88] mt-0.5">GPT-4o-mini · ChromaDB · Semantic search</p>
            </div>
            <span className="px-2.5 py-1 text-[0.6rem] font-semibold text-emerald-400 bg-emerald-500/8 border border-emerald-500/12 rounded-full">AI</span>
          </button>

          <button
            onClick={() => onSelect("tfidf")}
            className="group w-full flex items-center gap-4 p-[18px] rounded-2xl border border-white/[0.05] bg-white/[0.02] hover:bg-white/[0.05] hover:border-amber-500/25 transition-all duration-300 active:scale-[0.985]"
          >
            <div className="w-11 h-11 rounded-[14px] bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shrink-0 shadow-[0_4px_20px_rgba(245,158,11,0.2)] ring-1 ring-white/10">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            </div>
            <div className="flex-1 text-left">
              <p className="text-[0.9rem] font-semibold text-white/90 group-hover:text-white">TF-IDF Engine</p>
              <p className="text-[0.72rem] text-[#6E6E88] mt-0.5">scikit-learn · Offline · Zero config</p>
            </div>
            <span className="px-2.5 py-1 text-[0.6rem] font-semibold text-amber-400 bg-amber-500/8 border border-amber-500/12 rounded-full">Local</span>
          </button>
        </div>

        <p className="text-center text-[0.64rem] text-[#4A4A60] mt-8">
          Make sure the backend server is running first
        </p>
      </div>
    </div>
  );
}

export default React.memo(ModeSelector);
