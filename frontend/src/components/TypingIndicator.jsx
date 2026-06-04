import React from "react";

function TypingIndicator() {
  return (
    <div className="flex gap-3 self-start animate-in max-w-[75%]">
      <div className="w-8 h-8 rounded-[10px] sk-gradient flex items-center justify-center ring-1 ring-white/[0.08] shadow-md shrink-0">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </div>
      <div className="flex items-center gap-[5px] px-5 py-4 bg-white/[0.04] border border-white/[0.06] rounded-[18px] rounded-tl-[6px] shadow-[0_2px_16px_rgba(0,0,0,0.15)]">
        <span className="w-[5px] h-[5px] bg-[#6E6E88] rounded-full animate-dot" style={{ animationDelay: "0ms" }} />
        <span className="w-[5px] h-[5px] bg-[#6E6E88] rounded-full animate-dot" style={{ animationDelay: "150ms" }} />
        <span className="w-[5px] h-[5px] bg-[#6E6E88] rounded-full animate-dot" style={{ animationDelay: "300ms" }} />
      </div>
    </div>
  );
}

export default React.memo(TypingIndicator);
