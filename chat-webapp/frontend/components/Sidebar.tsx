import { useState, useRef, useEffect } from "react";
import ChatContextMenu from "./ChatContextMenu";
import UserMenu from "./UserMenu";
import {
  BuildingOfficeIcon,
  RectangleGroupIcon,
  PencilSquareIcon,
  MagnifyingGlassIcon,
  EllipsisVerticalIcon,
  PencilIcon,
  TrashIcon
} from "@heroicons/react/24/outline";

interface SidebarProps {
  givenName: string | null;
  surname: string | null;
  samAccount: string | null;
  username: string | null;
  onLogout: () => void;
}

interface ChatItem {
  id: string;
  name: string;
}

export default function Sidebar({
  givenName,
  surname,
  samAccount,
  username,
  onLogout,
}: SidebarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Chiudi il menu cliccando fuori
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node)
      ) {
        setActiveMenuId(null);
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initials = `${givenName?.[0] ?? ""}${surname?.[0] ?? ""}`;

  const chats: ChatItem[] = [
    { id: "1", name: "Chat con Mario Rossi" },
    { id: "2", name: "Progetto Azure ML" },
    { id: "3", name: "Team Meeting" },
    { id: "4", name: "Conversazione AI" },
    { id: "5", name: "Sviluppo Software" },
    { id: "6", name: "Installazione OpenShift" },
    { id: "7", name: "Configurazione FreeIPA" },
    { id: "8", name: "Conversazione di Prova" },
    { id: "9", name: "Frontend React" },
  ];

  return (
    <aside
      className={`drop-shadow-lg tracking-wide h-full bg-slate-900 flex flex-col justify-between p-1 relative transition-all duration-300 ${
        isCollapsed ? "w-auto" : "w-64"
      }`}
    >
      {/* Sezione di navigazione */}
      <nav className="text-slate-300 h-full">
        {/* Riga Home + Toggle Sidebar */}
        <div className="flex justify-between items-center mb-3">
          {!isCollapsed && (
            <button className="hover:bg-slate-700 rounded-lg p-2 transition-colors focus:outline-none">
              <BuildingOfficeIcon className="w-6 h-6" />
              <span className="sr-only">Home</span>
            </button>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hover:bg-slate-700 rounded-lg p-2 transition-colors focus:outline-none"
          >
            <RectangleGroupIcon className="w-6 h-6" />
            <span className="sr-only">Toggle Sidebar</span>
          </button>
        </div>

        {/* New Chat */}
        <div
          className={`flex items-center ${
            isCollapsed ? "justify-center" : "gap-2"
          } cursor-pointer hover:bg-slate-700 rounded-lg p-2 transition-colors`}
        >
          <PencilSquareIcon className="w-5 h-5" />
          {!isCollapsed && <span className="font-semibold text-slate-300">Nuova chat</span>}
        </div>

        {/* Search Chat */}
        <div
          className={`flex items-center ${
            isCollapsed ? "justify-center" : "gap-2"
          } mb-3 cursor-pointer hover:bg-slate-700 rounded-lg p-2 transition-colors`}
        >
          <MagnifyingGlassIcon className="w-5 h-5" />
          {!isCollapsed && <span className="font-semibold text-slate-300">Ricerca chat</span>}
        </div>

        {/* Storico conversazioni */}
        {!isCollapsed && (
          <section className="text-slate-300 text-sm overflow-y-auto p-2">
            <p className="font-semibold mb-2 text-slate-300">Conversazioni recenti</p>
            <ul className="text-xs">
              {chats.map((chat) => (
                <li
                  key={chat.id}
                  className="hover:bg-slate-700 rounded-lg p-2 cursor-pointer relative group"
                >
                  {chat.name}
                  {/* Pulsante tre puntini */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveMenuId(activeMenuId === chat.id ? null : chat.id);
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition"
                  >
                    <EllipsisVerticalIcon className="w-5 h-5 text-slate-400 hover:text-slate-200" />
                  </button>

                  {/* Menu contestuale */}
                  {activeMenuId === chat.id && (
                    <ChatContextMenu
                      onRename={() => console.log(`Rinomina chat ${chat.id}`)}
                      onDelete={() => console.log(`Cancella chat ${chat.id}`)}
                      onClose={() => setActiveMenuId(null)} // chiude il menu
                    />
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}
      </nav>

      {/* Area utente */}
      <div className="border-t border-slate-700 mb-1"></div>
      <div
        className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-slate-700 transition-colors"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Menu utente"
      >
        <div className="font-semibold tracking-wide border border-slate-300 rounded-full bg-blue-600 text-slate-100 text-[11px] w-6 h-6 flex items-center justify-center">
          {initials}
        </div>
        {!isCollapsed && (
          <div>
            <div className="text-slate-200 font-semibold tracking-wide">
              {givenName} {surname}
            </div>
            <div className="text-slate-400 text-xs tracking-wide">{samAccount}</div>
          </div>
        )}
      </div>

      {/* Popup menu utente */}
      {isMenuOpen && (
        <div ref={menuRef} className="absolute bottom-20 left-4 z-50">
          <UserMenu
            initials={initials}
            givenName={givenName}
            surname={surname}
            samAccount={samAccount}
            username={username}
            onLogout={onLogout}
          />
        </div>
      )}
    </aside>
  );
}