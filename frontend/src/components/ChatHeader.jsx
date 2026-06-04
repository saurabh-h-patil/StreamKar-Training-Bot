import React from "react";

function ChatHeader({ mode, modeInfo, onClear, onInfo, onSwitchMode }) {
  const other = mode === "rag" ? "tfidf" : "rag";
  const otherLabel = mode === "rag" ? "TF-IDF" : "RAG";

  return (
    <header className="flex items-center justify-between px-5 h-16 glass-strong border-b border-white/[0.04] shrink-0">
      <div className="flex items-center gap-3">
        {/* Logo */}
        <div className="relative">
          <div className="w-9 h-9 rounded-xl sk-gradient flex items-center justify-center shadow-[0_2px_12px_rgba(162,0,187,0.25)] ring-1 ring-white/10">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#07070D]" />
        </div>
        <div>
          <p className="text-[0.88rem] font-semibold text-white/90 leading-tight tracking-tight">StreamKar</p>
          <p className="text-[0.62rem] text-[#5E5E75] font-medium mt-px">{modeInfo.label}</p>
        </div>
      </div>

      <div className="flex items-center gap-0.5">
        <button onClick={() => onSwitchMode(other)} title={`Switch to ${otherLabel}`}
          className="h-7 px-2.5 flex items-center gap-1.5 rounded-lg text-[0.65rem] font-medium text-[#7E7E96] hover:text-white/80 hover:bg-white/[0.05] transition-all duration-200">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 2v6h-6" /><path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
            <path d="M3 22v-6h6" /><path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
          </svg>
          {otherLabel}
        </button>
        <button onClick={onClear} title="New chat"
          className="w-7 h-7 flex items-center justify-center rounded-lg text-[#5E5E75] hover:text-white/70 hover:bg-white/[0.05] transition-all duration-200">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
        <button onClick={onInfo} title="Info"
          className="w-7 h-7 flex items-center justify-center rounded-lg text-[#5E5E75] hover:text-white/70 hover:bg-white/[0.05] transition-all duration-200">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" />
          </svg>
        </button>
      </div>
    </header>
  );
}

export default React.memo(ChatHeader);
