
import Head from 'next/head';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useIsAuthenticated,
  useMsal,
} from '@azure/msal-react';
import { getMsalInstance, loginRequest } from '../msal';

// ✅ Disabilita SSR per evitare mismatch tra server e client
import dynamic from 'next/dynamic';

function LoginPage() {
  const { instance, inProgress } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const [navigating, setNavigating] = useState(false);
  const msal = getMsalInstance();
  const [showPrivacy, setShowPrivacy] = useState(false); // ✅ Stato popup

  // ✅ Redirect solo lato client
  useEffect(() => {
    if (isAuthenticated && !navigating) {
      setNavigating(true);
      window.location.replace('/chat'); // evita back al login
    }
  }, [isAuthenticated, navigating]);

  const handleLogin = () => {
    if (!msal) return;
    instance.loginRedirect(loginRequest).catch(console.error);
  };

  const handleLogout = () => {
    instance.logoutRedirect().catch(console.error);
  };

  const hasEnv =
    !!process.env.NEXT_PUBLIC_CLIENT_ID &&
    !!process.env.NEXT_PUBLIC_TENANT_ID &&
    !!process.env.NEXT_PUBLIC_REDIRECT_URI;

  return (
    <>
      <Head>
        <title>Accedi - AI Platform</title>
        /favicon.ico
        <meta name="robots" content="noindex" />
      </Head>

      {/* Sfondo enterprise */}
      <div className="min-h-screen bg-aurora text-slate-100">
        <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="grid w-full grid-cols-1 overflow-hidden card md:grid-cols-2">
            {/* LEFT: Hero */}
            <div className="relative hidden md:block">
              {/* ✅ Fix: aggiunto sizes per evitare warning */}
              <Image
                src="/hero-login.jpg"
                alt="Background hero"
                loading="eager"
                sizes="(max-width: 768px) 100vw, 50vw"
                fill
                >
              </Image>
            </div>

            {/* RIGHT: Pannello di login */}
            <div className="flex items-center justify-center p-8">
              <div className="w-full max-w-md min-h-[420px] flex flex-col justify-center">
                <h1 className="text-3xl font-bold">Accedi - AI Platform</h1>
                <p className="mt-2 text-sm text-slate-300">Effettua l'accesso per proseguire</p>

                {/* Avviso env mancanti */}
                {!hasEnv && (
                  <div className="mt-4 alert-error">
                    Variabili d’ambiente MSAL mancanti. Imposta{' '}
                    <code>NEXT_PUBLIC_CLIENT_ID</code>, <code>NEXT_PUBLIC_TENANT_ID</code> e{' '}
                    <code>NEXT_PUBLIC_REDIRECT_URI</code>.
                  </div>
                )}

                {/* Stato inizializzazione MSAL */}
                {inProgress !== 'none' && !isAuthenticated && (
                  <div className="mt-4 rounded-lg bg-slate-800/60 px-3 py-2 text-slate-200">
                    Autenticazione in corso...
                  </div>
                )}

                {/* Già autenticato */}
                <AuthenticatedTemplate>
                  <div className="mt-6 alert-ok">
                    Sei già autenticato. Reindirizzamento in corso…
                  </div>
                  <button onClick={handleLogout} className="mt-4 btn-neutral">
                    Logout
                  </button>
                </AuthenticatedTemplate>

                {/* Non autenticato */}
                <UnauthenticatedTemplate>
                  <button
                    onClick={handleLogin}
                    disabled={!hasEnv || inProgress !== 'none'}
                    className="mt-6 btn-primary"
                    aria-label="Accedi con Microsoft Entra ID"
                  >
                    {/* Placeholder logo Microsoft — sostituibile con l’asset ufficiale */}
                    <span aria-hidden="true" className="microsoft-logo">
                      <span className="m-red" />
                      <span className="m-green" />
                      <span className="m-blue" />
                      <span className="m-yellow" />
                    </span>
                    <span>Accedi con Microsoft Entra ID</span>
                  </button>

                  <div className="mt-4 text-xs text-slate-400">
                    <i>(<b>*</b>) Solo account dell'organizzazione gestiti da Microsoft Entra ID.</i>
                  </div>
                </UnauthenticatedTemplate>

                {/* Footer corretto */}
                <footer className="footer-thin">
                  {/* ✅ Fix hydration: fallback statico lato server */}
                  <span>
                    <b>
                      © {typeof window !== 'undefined' ? new Date().getFullYear() : '2025'} Core Team
                    </b>
                  </span>
                  <button
                    onClick={() => setShowPrivacy(true)}
                    className="hover:text-brand-50 transition-colors underline-offset-2"
                    style={{ textDecoration: 'none' }}
                  >
                    Privacy Policy
                  </button>
                </footer>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* ✅ Popup Privacy Policy */}
      {showPrivacy && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-slate-900 text-slate-100 p-6 rounded-lg max-w-2xl w-full shadow-xl overflow-y-auto max-h-[80vh]">
            <h2 className="text-xl font-bold mb-4">Privacy Policy</h2>
            <p className="mb-4 text-sm">
              Questa Privacy Policy è conforme al GDPR e alle normative USA. Raccogliamo e trattiamo
              i dati personali degli utenti per garantire l’accesso sicuro alla piattaforma AI.
            </p>
            <ul className="list-disc pl-5 text-sm space-y-2">
              <li>Dati raccolti: nome, email, ID aziendale, storico conversazioni.</li>
              <li>Finalità: autenticazione, sicurezza, miglioramento dei servizi AI.</li>
              <li>Conservazione: i dati sono conservati per il tempo necessario alla finalità dichiarata.</li>
              <li>Diritti: accesso, rettifica, cancellazione, portabilità dei dati.</li>
              <li>Protezione: cifratura, accesso controllato, monitoraggio continuo.</li>
              <li>Condivisione: nessuna condivisione con terze parti non autorizzate.</li>
            </ul>
            <p className="mt-4 text-sm">
              Per ulteriori dettagli, contatta il DPO aziendale o consulta le linee guida interne.
            </p>
            <button
              onClick={() => setShowPrivacy(false)}
              className="mt-6 btn-neutral w-full"
            >
              <b>Chiudi</b>
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// ✅ Disabilita SSR per evitare errori di hydration
export default dynamic(() => Promise.resolve(LoginPage), { ssr: false });
