import React from "react";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";

function ChatMessages({ messages, isLoading, messagesEndRef }) {
  return (
    <main className="flex-1 overflow-y-auto px-5 py-6 flex flex-col gap-4 scroll-smooth">
      {messages.length === 0 && (
        <div className="m-auto max-w-[400px] text-center animate-in">
          <div className="w-14 h-14 mx-auto rounded-2xl sk-gradient flex items-center justify-center shadow-[0_8px_36px_rgba(162,0,187,0.3)] ring-1 ring-white/10 mb-5">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              <circle cx="9" cy="10" r="1" fill="white" /><circle cx="15" cy="10" r="1" fill="white" />
              <path d="M9 14s1.5 2 3 2 3-2 3-2" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-white/90 mb-1.5">How can I help?</h2>
          <p className="text-[0.82rem] text-[#6E6E88] leading-relaxed">
            Ask me anything about StreamKar — features, streaming, earning, gifts, and more.
          </p>
        </div>
      )}

      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} />
      ))}

      {isLoading && <TypingIndicator />}
      <div ref={messagesEndRef} />
    </main>
  );
}

export default React.memo(ChatMessages);
