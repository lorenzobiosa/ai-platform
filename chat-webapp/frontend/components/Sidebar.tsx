import { useState, useRef, useEffect } from "react";
import UserMenu from "./UserMenu";
import {
  BuildingOfficeIcon,
  RectangleGroupIcon,
  PencilSquareIcon,
  MagnifyingGlassIcon
} from "@heroicons/react/24/outline";

interface SidebarProps {
  givenName: string | null;
  surname: string | null;
  samAccount: string | null;
  username: string | null;
  onLogout: () => void;
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
  const menuRef = useRef<HTMLDivElement>(null);

  // Chiudi il menu cliccando fuori
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initials = `${givenName?.[0] ?? ""}${surname?.[0] ?? ""}`;

  return (
    <aside
      className={`h-full bg-slate-900 flex flex-col justify-between p-1 relative transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Sezione di navigazione */}
      <nav className="text-slate-200 p-4">
        {/* Riga Home + Toggle Sidebar */}
        <div className="flex justify-between items-center mb-6">
          <button
            className="hover:text-blue-400 hover:bg-slate-700 rounded-lg p-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <BuildingOfficeIcon className="w-6 h-6" />
            <span className="sr-only">Home</span>
          </button>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hover:text-blue-400 hover:bg-slate-700 rounded-lg p-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <RectangleGroupIcon className="w-6 h-6" />
            <span className="sr-only">Toggle Sidebar</span>
          </button>
        </div>

        {/* New Chat */}
        {!isCollapsed && (
          <div className="flex items-center gap-2 mb-4 cursor-pointer hover:bg-slate-700 rounded-lg p-2 transition-colors">
            <PencilSquareIcon className="w-6 h-6" />
            <span className="text-slate-200 font-medium">New chat</span>
          </div>
        )}

        {/* Search Chat */}
        {!isCollapsed && (
          <div className="flex items-center gap-2 mb-6 cursor-pointer hover:bg-slate-700 rounded-lg p-2 transition-colors">
            <MagnifyingGlassIcon className="w-6 h-6" />
            <span className="text-slate-200 font-medium">Search chats</span>
          </div>
        )}

        {/* Storico conversazioni */}
        {!isCollapsed && (
          <section className="text-slate-300 text-sm overflow-y-auto max-h-64 border-t border-slate-700 pt-2">
            <p className="mb-2 font-semibold text-slate-400">Recent chats</p>
            <ul className="space-y-2">
              <li className="hover:bg-slate-700 rounded-lg p-2 cursor-pointer">
                Chat con Mario Rossi
              </li>
              <li className="hover:bg-slate-700 rounded-lg p-2 cursor-pointer">
                Progetto Azure ML
              </li>
              <li className="hover:bg-slate-700 rounded-lg p-2 cursor-pointer">
                Team Meeting
              </li>
              <li className="hover:bg-slate-700 rounded-lg p-2 cursor-pointer">
                Conversazione AI
              </li>
            </ul>
          </section>
        )}
      </nav>

      {/* Area utente */}
      <div className="border-t border-slate-700"></div>
      <div
        className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-slate-700 transition-colors"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Menu utente"
      >
        <div className="rounded-full bg-blue-600 text-white text-xs w-6 h-6 flex items-center justify-center">
          {initials}
        </div>
        {!isCollapsed && (
          <div>
            <div className="text-slate-200 font-semibold">
              {givenName} {surname}
            </div>
            <div className="text-slate-400 text-xs">{samAccount}</div>
          </div>
        )}
      </div>

      {/* Popup menu */}
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