import { useState } from "react";
import {
  ArrowUpCircleIcon,
  ClipboardIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";

interface Message {
  id: string;
  text: string;
  sent: boolean; // true = inviato dall'utente, false = ricevuto
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [inlineEditId, setInlineEditId] = useState<string | null>(null);

  // Invio messaggio dalla textarea principale
  const handleSend = () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { id: Date.now().toString(), text: input, sent: true }];
    setMessages(newMessages);
    setInput("");
  };

  // Attiva modalità edit inline
  const handleInlineEdit = (id: string) => {
    setInlineEditId(id);
  };

  // Conferma modifica inline
  const handleConfirmEdit = (id: string, newText: string) => {
    let newMessages = [...messages];
    const index = newMessages.findIndex((m) => m.id === id);
    if (index !== -1) {
      const oldText = newMessages[index].text;
      if (oldText !== newText.trim()) {
        newMessages[index].text = newText.trim();
        newMessages = newMessages.slice(0, index + 1); // Elimina successivi solo se modificato
      }
    }
    setMessages(newMessages);
    setInlineEditId(null);
  };

  return (
    <div className="flex flex-col h-full p-4 bg-slate-900 text-slate-200 text-sm font-medium">
      {/* Area messaggi */}
      <div className="flex-1 overflow-y-auto space-y-5">
        {messages.map((msg) => (
          <div
            key={msg.id}
            onMouseEnter={() => setHoveredId(msg.id)}
            onMouseLeave={() => setHoveredId(null)}
            className={`relative flex ${msg.sent ? "justify-end" : "justify-start"} mb-2`}
          >
            <div
              className={`inline-block p-3 rounded-xl border-2 max-w-[70%] ${
                msg.sent
                  ? "bg-slate-800 border-slate-400 text-slate-300 self-end"
                  : "bg-slate-700 border-slate-400 text-slate-300 self-start"
              } shadow-lg`}
            >
              {inlineEditId === msg.id ? (
                <textarea
                  value={msg.text}
                  onChange={(e) => {
                    const updated = messages.map((m) =>
                      m.id === msg.id ? { ...m, text: e.target.value } : m
                    );
                    setMessages(updated);
                  }}
                  onInput={(e) => {
                    e.currentTarget.style.height = 'auto';
                    e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleConfirmEdit(msg.id, msg.text);
                    }
                  }}
                  className={`inline-block max-w-[70%] ${
                    msg.sent
                      ? "bg-slate-800 border-slate-400 text-slate-300 self-end"
                      : "bg-slate-700 border-slate-400 text-slate-300 self-start"
                  } shadow-lg resize-none`}
                  style={{ fontSize: "inherit" }}
                />
              ) : (
                <span className="whitespace-pre-wrap">{msg.text}</span>
              )}
            </div>

            {/* Popup con icone */}
            {hoveredId === msg.id && (
              <div className="absolute bottom-0 right-4 translate-y-1/2 flex gap-2 bg-slate-700/80 backdrop-blur-sm border border-slate-500 rounded-md p-1 shadow-xl z-50 transition transform duration-200 ease-out scale-95 hover:scale-100 opacity-90">
                <ClipboardIcon
                  className="w-4 h-4 text-slate-200 hover:text-blue-400 cursor-pointer"
                  onClick={() => navigator.clipboard.writeText(msg.text)}
                />
                {msg.sent && (
                  <PencilSquareIcon
                    className="w-4 h-4 text-slate-200 hover:text-blue-400 cursor-pointer"
                    onClick={() => handleInlineEdit(msg.id)}
                  />
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Area input principale */}
      <div className="mt-4 flex items-center gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Scrivi un messaggio..."
          rows={3}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          className="flex-1 rounded-lg px-4 py-2 bg-slate-800 text-slate-200 focus:outline-none resize-none whitespace-pre-wrap"
        />
        <button
          onClick={handleSend}
          className="btn-blu flex items-center gap-2"
        >
          <ArrowUpCircleIcon className="w-6 h-6" />
          Invia
        </button>
      </div>
    </div>
  );
}