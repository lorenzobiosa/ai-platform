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

  const handleInlineEdit = (id: string) => setInlineEditId(id);
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
          <h1 className="text-6xl font-bold mb-8 mt-24 bg-transparent drop-shadow-lg select-none">AI Platform</h1>

          {/* INPUT PILL (wrapper centrato e relativo) */}
          <div className="relative mx-auto w-full max-w-2xl flex items-center">
            <textarea
              value={inputText}
              onChange={(e) => {
                const words = e.target.value.trim().split(/\s+/);
                if (words.length <= 750000) {
                  setInputText(e.target.value);
                }
              }}
              placeholder="Scrivi un comando..."
              rows={1}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  onSend();
                }
              }}
              className="tracking-wide drop-shadow-lg w-full p-3 pl-14 pr-14 rounded-lg border border-slate-300 text-slate-300 bg-slate-700 focus:outline-none resize-none no-scrollbar"
            />
            <button className="absolute left-1 top-1/2 -translate-y-1/2 p-2 hover:bg-slate-500 rounded-lg transition-all duration-200">
              <PaperClipIcon className="h-6 w-6 text-slate-300" />
            </button>
            <button
              onClick={onSend}
              className="absolute right-1 top-1/2 -translate-y-1/2 p-2 hover:bg-slate-500 rounded-lg transition-all duration-200"
            >
              <ArrowUpCircleIcon className="h-6 w-6 text-slate-300" />
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* ✅ AREA MESSAGGI — stesso wrapper centrato della input */}
          <div className="w-full flex-1 overflow-y-auto">
            <span className="pl-2 text-xl font-semibold tracking-wide text-slate-100 bg-transparent tracking-wide drop-shadow-lg select-none">AI Platform</span>
            <div className="mt-4 mx-auto w-full max-w-2xl space-y-5">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  onMouseEnter={() => setHoveredId(msg.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className={`relative flex ${msg.sent ? "justify-end" : "justify-start"}`}
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
          </div>

          {/* ✅ INPUT PILL — identica alla homepage */}
          <div className="w-full mt-4 mb-4">
            <div className="relative mx-auto w-full max-w-2xl flex items-center">
              <textarea
                value={inputText}
                onChange={(e) => {
                  const words = e.target.value.trim().split(/\s+/);
                  if (words.length <= 750000) {
                    setInputText(e.target.value);
                  }
                }}
                placeholder="Scrivi un comando..."
                rows={1}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    onSend();
                  }
                }}
                className="tracking-wide drop-shadow-lg w-full p-3 pl-14 pr-14 rounded-lg border border-slate-300 text-slate-300 bg-slate-700 focus:outline-none resize-none no-scrollbar"
              />
              <button
                className="absolute left-1 top-1/2 -translate-y-1/2 p-2 hover:bg-slate-500 rounded-lg transition-all duration-200"
                aria-label="Allega file"
                type="button"
              >
                <PaperClipIcon className="h-6 w-6 text-slate-300" />
              </button>
              <button
                onClick={onSend}
                className="absolute right-1 top-1/2 -translate-y-1/2 p-2 hover:bg-slate-500 rounded-lg transition-all duration-200"
                aria-label="Invia"
                type="button"
              >
                <ArrowUpCircleIcon className="h-6 w-6 text-slate-300" />
              </button>
            </div>
            
          </div>
        </>
      )}
    </div>
  );
}