import React from "react";

function WelcomeCard({ mode = "rag", modeInfo }) {
  return (
    <div className="m-auto max-w-[440px] animate-slide-up">
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto rounded-2xl sk-gradient flex items-center justify-center shadow-[0_8px_32px_rgba(162,0,187,0.3)] mb-5">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 8V4H8" /><rect x="4" y="8" width="16" height="12" rx="2" />
            <circle cx="9" cy="14" r="1.5" fill="white" /><circle cx="15" cy="14" r="1.5" fill="white" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-txt-primary mb-2">
          How can I help you today?
        </h2>
        <p className="text-sm text-txt-secondary leading-relaxed max-w-[360px] mx-auto">
          Ask me anything about StreamKar — features, earning money, gifts, streaming tips, and more.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2.5 max-sm:grid-cols-1">
        {[
          { icon: "💰", q: "How do I earn money?" },
          { icon: "🎁", q: "What are Gifts?" },
          { icon: "⚔️", q: "What is a PK Match?" },
          { icon: "👑", q: "VIP memberships" },
        ].map((item) => (
          <button
            key={item.q}
            className="flex items-center gap-2.5 px-4 py-3 bg-white/[0.03] border border-white/[0.06] rounded-xl text-left hover:bg-white/[0.06] hover:border-white/[0.1] transition-all duration-200 active:scale-[0.97] group"
          >
            <span className="text-lg">{item.icon}</span>
            <span className="text-[0.78rem] text-txt-secondary group-hover:text-txt-primary transition-colors">
              {item.q}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default React.memo(WelcomeCard);
