import { ClipboardIcon, PencilSquareIcon } from "@heroicons/react/24/outline";

interface MessageBoxProps {
  msg: { id: string; text: string; sent: boolean };
  isHovered: boolean;
  isEditing: boolean;
  onEditStart: (id: string) => void;
  onEditConfirm: (id: string, newText: string) => void;
  onChangeText: (id: string, value: string) => void;
}

export default function MessageBox({
  msg,
  isHovered,
  isEditing,
  onEditStart,
  onEditConfirm,
  onChangeText,
}: MessageBoxProps) {
  return (
    <div
      className={`inline-block p-3 rounded-xl border-2 max-w-[70%] ${
        msg.sent
          ? "bg-slate-700 border-slate-400 text-slate-300 self-end"
          : "bg-slate-700 border-slate-400 text-slate-300 self-start"
      } shadow-lg relative`}
    >
      {isEditing ? (
        <textarea
          value={msg.text}
          onChange={(e) => onChangeText(msg.id, e.target.value)}
          onInput={(e) => {
            e.currentTarget.style.height = "auto";
            e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onEditConfirm(msg.id, msg.text);
            }
          }}
          className="w-full resize-none rounded-xl border-2 p-3"
          style={{ fontSize: "inherit", height: "auto", overflow: "hidden" }}
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