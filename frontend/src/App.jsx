import React, { useState, useRef, useCallback } from "react";
import ChatHeader from "./components/ChatHeader";
import ChatMessages from "./components/ChatMessages";
import SuggestionChips from "./components/SuggestionChips";
import ChatInput from "./components/ChatInput";
import InfoModal from "./components/InfoModal";
import ModeSelector from "./components/ModeSelector";

const BACKENDS = {
  rag: { base: "/api/rag", label: "LangChain RAG", tag: "AI-Powered", port: 5000 },
  tfidf: { base: "/api/tfidf", label: "TF-IDF Engine", tag: "Zero-Config", port: 5001 },
};

function App() {
  const [mode, setMode] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const messagesEndRef = useRef(null);

  const scroll = useCallback(() => {
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 80);
  }, []);

  const sendMessage = useCallback(
    async (text) => {
      if (!text.trim() || isLoading || !mode) return;
      setMessages((p) => [...p, { id: Date.now(), role: "user", content: text.trim(), ts: new Date() }]);
      setShowSuggestions(false);
      setIsLoading(true);
      scroll();
      try {
        const res = await fetch(`${BACKENDS[mode].base}/ask`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: text.trim() }),
        });
        if (!res.ok) throw new Error(res.status);
        const d = await res.json();
        setMessages((p) => [...p, { id: Date.now() + 1, role: "bot", content: d.answer, ts: new Date() }]);
      } catch {
        setMessages((p) => [
          ...p,
          { id: Date.now() + 1, role: "bot", content: `Unable to reach the **${BACKENDS[mode].label}** backend. Make sure it's running on port **${BACKENDS[mode].port}**.`, ts: new Date() },
        ]);
      } finally {
        setIsLoading(false);
        scroll();
      }
    },
    [isLoading, mode, scroll]
  );

  const switchMode = useCallback((m) => { setMode(m); setMessages([]); setShowSuggestions(true); }, []);

  if (!mode) return <ModeSelector onSelect={setMode} />;

  return (
    <div className="relative flex flex-col h-dvh max-w-[860px] mx-auto border-x border-white/[0.03]">
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-30%] left-[-15%] w-[600px] h-[600px] rounded-full bg-[#A200BB]/[0.04] blur-[150px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#FF6B9D]/[0.03] blur-[130px]" />
      </div>

      <ChatHeader mode={mode} modeInfo={BACKENDS[mode]} onClear={() => { setMessages([]); setShowSuggestions(true); }} onInfo={() => setShowModal(true)} onSwitchMode={switchMode} />
      <ChatMessages messages={messages} isLoading={isLoading} messagesEndRef={messagesEndRef} />
      {showSuggestions && messages.length === 0 && <SuggestionChips onSelect={sendMessage} />}
      <ChatInput onSend={sendMessage} isLoading={isLoading} />
      <InfoModal isOpen={showModal} onClose={() => setShowModal(false)} mode={mode} />
    </div>
  );
}

export default App;
