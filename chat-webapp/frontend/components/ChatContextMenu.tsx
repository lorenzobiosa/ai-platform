import { useEffect, useRef } from "react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

interface ChatContextMenuProps {
  onRename: () => void;
  onDelete: () => void;
  onClose: () => void; // callback per chiudere il menu
}

export default function ChatContextMenu({ onRename, onDelete, onClose }: ChatContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      className="absolute right-10 top-1/2 -translate-y-1/2 bg-slate-800 rounded-lg shadow-lg p-2 flex flex-col gap-2 z-50 w-32"
    >
      <button
        onClick={onRename}
        className="flex items-center gap-2 hover:bg-slate-700 p-2 rounded text-slate-300"
      >
        <PencilIcon className="w-4 h-4" />
        <span>Rinomina</span>
      </button>
      <button
        onClick={onDelete}
        className="flex items-center gap-2 hover:bg-slate-700 p-2 rounded text-rose-500"
      >
        <TrashIcon className="w-4 h-4" />
        <span>Cancella</span>
      </button>
    </div>
  );
}