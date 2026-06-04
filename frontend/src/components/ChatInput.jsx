import React, { useState, useRef, useEffect, useCallback } from "react";

function ChatInput({ onSend, isLoading }) {
  const [text, setText] = useState("");
  const ref = useRef(null);
  const hasText = text.trim().length > 0;

  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = "auto";
      ref.current.style.height = Math.min(ref.current.scrollHeight, 120) + "px";
    }
  }, [text]);

  const send = useCallback(() => {
    if (!hasText || isLoading) return;
    onSend(text);
    setText("");
  }, [text, hasText, isLoading, onSend]);

  return (
    <footer className="px-5 py-3 glass-strong border-t border-white/[0.03] shrink-0">
      <div className={`flex items-end gap-2 rounded-2xl px-4 py-1.5 transition-all duration-300 ${
        hasText
          ? "bg-white/[0.05] ring-1 ring-[#A200BB]/25 shadow-[0_0_24px_rgba(162,0,187,0.06)]"
          : "bg-white/[0.03] ring-1 ring-white/[0.04]"
      }`}>
        <textarea
          ref={ref}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
          placeholder="Message StreamKar..."
          rows={1}
          maxLength={500}
          disabled={isLoading}
          className="flex-1 bg-transparent border-none outline-none text-white/90 text-[0.86rem] leading-relaxed resize-none max-h-[120px] py-2 placeholder:text-[#4A4A60] disabled:opacity-40 font-[inherit]"
        />
        <button
          onClick={send}
          disabled={!hasText || isLoading}
          className={`w-9 h-9 min-w-[36px] flex items-center justify-center rounded-xl transition-all duration-200 mb-0.5 ${
            hasText && !isLoading
              ? "sk-gradient text-white shadow-[0_2px_12px_rgba(162,0,187,0.3)] hover:shadow-[0_4px_20px_rgba(162,0,187,0.45)] hover:scale-105 active:scale-95 cursor-pointer"
              : "bg-transparent text-[#3A3A50]"
          }`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 2L11 13" /><path d="M22 2L15 22L11 13L2 9L22 2Z" />
          </svg>
        </button>
      </div>
    </footer>
  );
}

export default React.memo(ChatInput);
