import React, { useMemo } from "react";
import ReactMarkdown from "react-markdown";

function MessageBubble({ message }) {
  const { role, content, ts } = message;
  const isUser = role === "user";

  const time = useMemo(() => {
    if (!ts) return "";
    return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }, [ts]);

  return (
    <div className={`flex gap-3 max-w-[75%] animate-in ${isUser ? "self-end flex-row-reverse" : "self-start"}`}>
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-[10px] shrink-0 mt-0.5 flex items-center justify-center ring-1 ring-white/[0.08] shadow-md ${
        isUser ? "bg-gradient-to-br from-indigo-500 to-violet-600" : "sk-gradient"
      }`}>
        {isUser ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
      </div>

      {/* Content */}
      <div className="space-y-1">
        <div className={`px-4 py-3 text-[0.86rem] leading-[1.7] break-words ${
          isUser
            ? "bg-gradient-to-br from-[#A200BB] to-[#D44FE0] text-white rounded-[18px] rounded-tr-[6px] shadow-[0_2px_16px_rgba(162,0,187,0.2)]"
            : "bg-white/[0.04] border border-white/[0.06] text-[#D0D0DE] rounded-[18px] rounded-tl-[6px] shadow-[0_2px_16px_rgba(0,0,0,0.15)]"
        }`}>
          {isUser ? content : (
            <div className="bot-md">
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          )}
        </div>
        <p className={`text-[0.6rem] text-[#3E3E55] px-1 ${isUser ? "text-right" : ""}`}>{time}</p>
      </div>
    </div>
  );
}

export default React.memo(MessageBubble);
