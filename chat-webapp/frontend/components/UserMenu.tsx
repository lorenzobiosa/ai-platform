import {
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";

interface UserMenuProps {
  initials: string;
  givenName: string | null;
  surname: string | null;
  samAccount: string | null;
  username: string | null; // Usa account?.username
  onLogout: () => void;
}

export default function UserMenu({
  initials,
  givenName,
  surname,
  samAccount,
  username,
  onLogout,
}: UserMenuProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);

  return (
    <>
      {/* Menu principale */}
      <div className="bg-slate-800 rounded-xl shadow-xl p-4 w-56">
        {/* Header utente con hover e click */}
        <div
          className="flex items-center gap-3 mb-4 p-2 rounded-lg hover:bg-slate-700 transition-colors cursor-pointer"
          onClick={() => setShowDetails(true)}
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

        <hr className="border-slate-700 my-2" />

        {/* Opzioni con icone */}
        <div className="flex flex-col space-y-2">
          <button className="btn-neutral w-full flex items-center gap-2 text-left">
            <Cog6ToothIcon className="w-5 h-5 text-slate-300" aria-hidden="true" />
            Impostazioni
          </button>
          <button className="btn-neutral w-full flex items-center gap-2 text-left">
            <QuestionMarkCircleIcon className="w-5 h-5 text-slate-300" aria-hidden="true" />
            Aiuto
          </button>
        </div>

        <hr className="border-slate-700 my-2" />

        {/* Logout con conferma */}
        <button
          onClick={() => setConfirmLogout(true)}
          className="btn-neutral w-full flex items-center gap-2 text-left text-red-400 hover:text-red-300"
        >
          <ArrowRightOnRectangleIcon className="w-5 h-5" aria-hidden="true" />
          Logout
        </button>
      </div>

      {/* Popup dettagli utente */}
      {showDetails && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-xl shadow-xl p-6 w-96 animate-fadeIn">
            <div className="flex flex-col items-center mb-4">
              <div className="rounded-full bg-blue-600 text-white w-16 h-16 flex items-center justify-center text-xl">
                {initials}
              </div>
              <h2 className="text-slate-100 font-bold mt-2">Dettagli Utente</h2>
            </div>
            <div className="space-y-2 text-slate-300">
              <p><strong>Nome:</strong> {givenName}</p>
              <p><strong>Cognome:</strong> {surname}</p>
              <p><strong>Username:</strong> {samAccount}</p>
              <p><strong>E-mail:</strong> {username ?? "Non disponibile"}</p>
            </div>
            <button
              onClick={() => setShowDetails(false)}
              className="btn-neutral w-full mt-4"
            >
              Chiudi
            </button>
          </div>
        </div>
      )}

      {/* Popup conferma logout */}
      {confirmLogout && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-xl shadow-xl p-6 w-80 text-center animate-fadeIn">
            <h2 className="text-slate-100 font-bold mb-4">Confermi il logout?</h2>
            <div className="flex gap-4 justify-center">
              <button
                onClick={onLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-500"
              >
                Conferma
              </button>
              <button
                onClick={() => setConfirmLogout(false)}
                className="btn-neutral px-4 py-2"
              >
                Annulla
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}