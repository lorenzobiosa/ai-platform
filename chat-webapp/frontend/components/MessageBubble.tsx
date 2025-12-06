import { useRef, useEffect, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { ClipboardIcon, PencilSquareIcon } from "@heroicons/react/24/outline";

interface MessageBubbleProps {
  msg: { id: string; text: string; sent: boolean };
  isHovered: boolean;
  isEditing: boolean;
  onEditStart: (id: string) => void;
  onEditConfirm: (id: string, newText: string) => void;
  onChangeText: (id: string, value: string) => void;
}

export default function MessageBubble({
  msg,
  isHovered,
  isEditing,
  onEditStart,
  onEditConfirm,
  onChangeText,
}: MessageBubbleProps) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [boxWidth, setBoxWidth] = useState<string>("100%");

  useEffect(() => {
    if (boxRef.current) {
      const style = window.getComputedStyle(boxRef.current);
      const paddingLeft = parseFloat(style.paddingLeft);
      const paddingRight = parseFloat(style.paddingRight);
      const rect = boxRef.current.getBoundingClientRect();
      setBoxWidth(`${rect.width - paddingLeft - paddingRight}px`);
    }
  }, [isEditing]);

  return (
    <div
      ref={boxRef}
      className={`block p-3 rounded-lg max-w-[70%] ${
        msg.sent
          ? "bg-slate-700 text-slate-300 self-end"
          : "bg-slate-700 text-slate-300 self-start"
      } shadow-lg relative`}
    >
      {isEditing ? (
        <TextareaAutosize
          value={msg.text}
          onChange={(e) => onChangeText(msg.id, e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onEditConfirm(msg.id, msg.text);
            }
          }}
          minRows={1}
          className="resize-none rounded-lg bg-transparent text-slate-300 focus:outline-none transition-all duration-150"
          style={{
            fontSize: "inherit",
            width: boxWidth, // stessa larghezza del box
          }}
        />
      ) : (
        <span className="whitespace-pre-wrap">{msg.text}</span>
      )}
      {isHovered && (
        <div className="absolute bottom-0 right-4 translate-y-1/2 flex gap-2 bg-slate-700/80 backdrop-blur-sm border border-slate-500 rounded-md p-1 shadow-xl z-50 transition transform duration-200 ease-out scale-95 hover:scale-100 opacity-90">
          <ClipboardIcon
            className="w-4 h-4 text-slate-200 hover:text-blue-400 cursor-pointer"
            onClick={() => navigator.clipboard.writeText(msg.text)}
          />
          {msg.sent && (
            <PencilSquareIcon
              className="w-4 h-4 text-slate-200 hover:text-blue-400 cursor-pointer"
              onClick={() => onEditStart(msg.id)}
            />
          )}
        </div>
      )}
    </div>
  );
}