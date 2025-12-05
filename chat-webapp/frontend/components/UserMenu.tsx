import {
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

interface UserMenuProps {
  initials: string;
  givenName: string | null;
  surname: string | null;
  samAccount: string | null;
  onLogout: () => void;
}

export default function UserMenu({
  initials,
  givenName,
  surname,
  samAccount,
  onLogout,
}: UserMenuProps) {
  return (
    <div className="bg-slate-800 rounded-xl shadow-xl p-4 w-56">
      {/* Header utente */}
      <div className="flex items-center gap-3 mb-4">
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

      {/* Opzioni con icone e più spazio */}
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

      {/* Logout con icona */}
      <button
        onClick={onLogout}
        className="btn-neutral w-full flex items-center gap-2 text-left text-red-400 hover:text-red-300"
      >
        <ArrowRightOnRectangleIcon className="w-5 h-5" aria-hidden="true" />
        Logout
      </button>
    </div>
  );
}