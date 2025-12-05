
import { useState } from "react";
import {
  PaperClipIcon,
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
  const [editId, setEditId] = useState<string | null>(null);

  // Invio messaggio
  const handleSend = () => {
    if (!input.trim()) return;

    let newMessages = [...messages];

    if (editId) {
      // Modifica messaggio esistente e rimuovi successivi
      const index = newMessages.findIndex((m) => m.id === editId);
      if (index !== -1) {
        newMessages[index].text = input;
        newMessages = newMessages.slice(0, index + 1);
      }
      setEditId(null);
    } else {
      newMessages.push({ id: Date.now().toString(), text: input, sent: true });
    }

    setMessages(newMessages);
    setInput("");
  };

  // Copia messaggio
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // Modifica messaggio
  const handleEdit = (id: string, text: string) => {
    setInput(text);
    setEditId(id);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900">
      {/* Area messaggi */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`relative group card p-3 ${
              msg.sent ? "bg-slate-800 text-slate-200" : "bg-slate-700 text-slate-100"
            }`}
          >
            <p>{msg.text}</p>
            <div className="absolute top-2 right-2 hidden group-hover:flex gap-2">
              <ClipboardIcon
                className="w-5 h-5 cursor-pointer hover:text-blue-400"
                onClick={() => handleCopy(msg.text)}
              />
              {msg.sent && (
                <PencilSquareIcon
                  className="w-5 h-5 cursor-pointer hover:text-blue-400"
                  onClick={() => handleEdit(msg.id, msg.text)}
                />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Area input */}
      <div className="border-t border-slate-700 p-2 flex items-center gap-2">
        <button className="btn-neutral" aria-label="Allega file">
          <PaperClipIcon className="w-6 h-6" />
        </button>
        <textarea
          className="flex-1 resize-none rounded-lg bg-slate-800 text-slate-200 p-2"
          rows={1}
          placeholder="Scrivi un messaggio..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button className="btn-blu"
          //className="btn-primary w-12 h-12 flex items-center justify-center"
          aria-label="Invia messaggio"
          onClick={handleSend}
        >
          <ArrowUpCircleIcon className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
