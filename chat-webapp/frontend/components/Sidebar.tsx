import { useState, useRef, useEffect } from "react";
import UserMenu from "./UserMenu";

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
    <aside className="w-64 bg-slate-900 flex flex-col justify-between p-4 relative">
      {/* Links della sidebar */}
      <nav className="space-y-4 text-slate-200">
        <a href="#" className="hover:text-blue-400 transition-colors">
          Chat
        </a>
        <a href="#" className="hover:text-blue-400 transition-colors">
          Impostazioni
        </a>
      </nav>

      {/* Area utente */}
      <div
        className="flex items-center gap-3 cursor-pointer mt-4 p-2 rounded-lg hover:bg-slate-700 transition-colors"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Menu utente"
      >
        <div className="rounded-full bg-blue-600 text-white w-10 h-10 flex items-center justify-center">
          {initials}
        </div>
        <div>
          <div className="text-slate-100 font-semibold">
            {givenName} {surname}
          </div>
          <div className="text-slate-400 text-sm">{samAccount}</div>
        </div>
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