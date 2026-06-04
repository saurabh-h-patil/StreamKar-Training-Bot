import React from "react";

function SuggestionChips({ onSelect }) {
  const items = [
    { icon: "💎", text: "What are Diamonds?" },
    { icon: "💰", text: "How to earn money?" },
    { icon: "⚔️", text: "What is a PK Match?" },
    { icon: "📱", text: "How to download?" },
    { icon: "👑", text: "VIP memberships" },
    { icon: "🎙️", text: "How to go live?" },
  ];

  return (
    <div className="px-5 pb-2">
      <div className="grid grid-cols-2 gap-2 max-sm:grid-cols-1">
        {items.map(({ icon, text }) => (
          <button
            key={text}
            onClick={() => onSelect(text)}
            className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-white/[0.02] border border-white/[0.05] text-left hover:bg-white/[0.05] hover:border-white/[0.08] transition-all duration-200 active:scale-[0.97] group"
          >
            <span className="text-base opacity-70 group-hover:opacity-100 transition-opacity">{icon}</span>
            <span className="text-[0.78rem] text-[#8888A0] group-hover:text-white/80 transition-colors font-medium">{text}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default React.memo(SuggestionChips);
