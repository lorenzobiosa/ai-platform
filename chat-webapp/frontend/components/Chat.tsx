import { useState } from "react";
import { ArrowUpCircleIcon, PaperClipIcon } from "@heroicons/react/24/outline";
import MessageBubble from "./MessageBubble";

interface Message {
  id: string;
  text: string;
  sent: boolean;
}

interface ChatProps {
  messages: Message[];
  inputText: string;
  setInputText: (value: string) => void;
  onSend: () => void;
}

export default function Chat({ messages, inputText, setInputText, onSend }: ChatProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [inlineEditId, setInlineEditId] = useState<string | null>(null);

  const handleInlineEdit = (id: string) => {
    setInlineEditId(id);
  };

  const handleConfirmEdit = (id: string, newText: string) => {
    let newMessages = [...messages];
    const index = newMessages.findIndex((m) => m.id === id);
    if (index !== -1) {
      const oldText = newMessages[index].text;
      if (oldText !== newText.trim()) {
        newMessages[index].text = newText.trim();
        newMessages = newMessages.slice(0, index + 1);
      }
    }
    setInlineEditId(null);
  };

  const handleChangeText = (id: string, value: string) => {
    console.log(`Modifica messaggio ${id}: ${value}`);
  };

  const hasMessages = messages.length > 0;

  return (
    <div className="flex flex-col h-full p-4 bg-slate-800 text-slate-200 text-sm">
      {!hasMessages ? (
        // ✅ Layout iniziale
        <div className="flex flex-col items-center justify-start flex-1 text-center pt-32">
          <h1 className="text-6xl font-bold mb-8 mt-24">AI Platform</h1>
          <div className="relative w-full max-w-xl flex items-center">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Scrivi un comando..."
              rows={1}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  onSend();
                }
              }}
              className="w-full p-3 pl-14 pr-14 rounded-full border border-slate-300 text-slate-300 bg-slate-700 focus:outline-none resize-none no-scrollbar"
            />
            {/* Pulsante allega */}
            <button className="absolute left-1 top-1/2 transform -translate-y-1/2 p-2 hover:bg-slate-500 rounded-full transition-all duration-200">
              <PaperClipIcon className="h-6 w-6 text-slate-300" />
            </button>
            {/* Pulsante invia */}
            <button
              onClick={onSend}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 p-2 hover:bg-slate-500 rounded-full transition-all duration-200"
            >
              <ArrowUpCircleIcon className="h-6 w-6 text-slate-300" />
            </button>
          </div>
        </div>
      ) : (
        // ✅ Layout chat classico
        <>
          {/* Area messaggi */}
          <div className="flex-1 overflow-y-auto space-y-5">
            {messages.map((msg) => (
              <div
                key={msg.id}
                onMouseEnter={() => setHoveredId(msg.id)}
                onMouseLeave={() => setHoveredId(null)}
                className={`relative flex ${msg.sent ? "justify-end" : "justify-start"} mb-2`}
              >
                <MessageBubble
                  msg={msg}
                  isHovered={hoveredId === msg.id}
                  isEditing={inlineEditId === msg.id}
                  onEditStart={handleInlineEdit}
                  onEditConfirm={handleConfirmEdit}
                  onChangeText={handleChangeText}
                />
              </div>
            ))}
          </div>

          {/* Area input principale */}
          <div className="mt-4 flex items-center gap-2">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Scrivi un messaggio..."
              rows={3}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  onSend();
                }
              }}
              className="inline-block p-3 rounded-lg border-1 border-slate-300 text-slate-300 flex-1 px-4 py-2 bg-slate-700 focus:outline-none resize-none whitespace-pre-wrap"
            />
            <button onClick={onSend} className="btn-blu flex items-center gap-2">
              <ArrowUpCircleIcon className="w-6 h-6" />
              Invia
            </button>
          </div>
        </>
      )}
    </div>
  );
}