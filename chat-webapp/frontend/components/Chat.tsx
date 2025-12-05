import { useState } from "react";
import { ArrowUpCircleIcon } from "@heroicons/react/24/outline";
import MessageBox from "./MessageBox";

interface Message {
  id: string;
  text: string;
  sent: boolean;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [inlineEditId, setInlineEditId] = useState<string | null>(null);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { id: Date.now().toString(), text: input, sent: true }];
    setMessages(newMessages);
    setInput("");
  };

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
    setMessages(newMessages);
    setInlineEditId(null);
  };

  const handleChangeText = (id: string, value: string) => {
    const updated = messages.map((m) => (m.id === id ? { ...m, text: value } : m));
    setMessages(updated);
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
            <MessageBox
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
        <button onClick={handleSend} className="btn-blu flex items-center gap-2">
          <ArrowUpCircleIcon className="w-6 h-6" />
          Invia
        </button>
      </div>
    </div>
  );
}