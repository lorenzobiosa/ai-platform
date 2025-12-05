import dynamic from "next/dynamic";
import Head from "next/head";
import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { InteractionStatus, InteractionRequiredAuthError } from "@azure/msal-browser";
import { loginRequest, getMsalInstance } from "../msal";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";

function ChatPageInner() {
  const msalInstance = getMsalInstance();
  const { accounts, inProgress, instance } = useMsal();
  const isAuthenticated = useIsAuthenticated();

  // Stato per i dati utente
  const [samAccount, setSamAccount] = useState<string | null>(null);
  const [givenName, setGivenName] = useState<string | null>(null);
  const [surname, setSurname] = useState<string | null>(null);

  /**
   * Login automatico se non autenticato
   */
  useEffect(() => {
    if (!msalInstance) return;
    if (inProgress === InteractionStatus.None && !isAuthenticated) {
      const attempted = sessionStorage.getItem("msal_login_attempted");
      if (attempted !== "true") {
        sessionStorage.setItem("msal_login_attempted", "true");
        msalInstance.loginRedirect(loginRequest).catch(console.error);
      }
    }
  }, [inProgress, isAuthenticated, msalInstance]);

  /**
   * Recupera dati utente da Microsoft Graph
   */
  useEffect(() => {
    if (!isAuthenticated || !accounts[0] || !msalInstance) return;

    const account = accounts[0];

    const fetchGraphData = async () => {
      try {
        const response = await msalInstance.acquireTokenSilent({ ...loginRequest, account });
        const token = response.accessToken;

        const graphResponse = await fetch(
          "https://graph.microsoft.com/v1.0/me?$select=onPremisesSamAccountName,givenName,surname",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!graphResponse.ok) throw new Error("Graph API error");

        const data = await graphResponse.json();
        setSamAccount(data.onPremisesSamAccountName);
        setGivenName(data.givenName);
        setSurname(data.surname);
      } catch (err: any) {
        if (err instanceof InteractionRequiredAuthError) {
          msalInstance.acquireTokenRedirect({ ...loginRequest, account });
        } else {
          console.error(err);
        }
      }
    };

    fetchGraphData();
  }, [isAuthenticated, accounts, msalInstance]);

  /**
   * Se non autenticato, mostra messaggio di attesa
   */
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen text-slate-200">
        Verifica autenticazione…
      </div>
    );
  }

  const account = instance.getActiveAccount() ?? accounts[0];

  /**
   * Logout sicuro
   */
  const handleLogout = () => {
    try {
      sessionStorage.removeItem("msal_login_attempted");
      sessionStorage.removeItem("msal_callback_handled");
    } catch {}
    msalInstance?.logoutRedirect();
  };

  /**
   * Layout principale con Sidebar e area chat
   */
  return (
    <>
      <Head>
        <title>Chat - AI Platform</title>
      </Head>
      <div className="flex h-screen bg-slate-900">
        {/* Sidebar con dati utente */}
        <Sidebar
          givenName={givenName}
          surname={surname}
          samAccount={samAccount}
          username={account?.username}
          onLogout={handleLogout}
        />
  
        {/* Area principale della chat */}
        <main className="flex-1 p-6 text-slate-100 overflow-y-auto">
          <h1 className="text-2xl font-bold mb-4">Autenticato correttamente su Azure AD</h1>
          <div className="space-y-2 mb-6">
            <p><strong>Username:</strong> {account?.username}</p>
            <p><strong>Display Name:</strong> {account?.name}</p>
            <p><strong>Given Name:</strong> {givenName ?? "Caricamento…"} </p>
            <p><strong>Surname:</strong> {surname ?? "Caricamento…"} </p>
            <p><strong>SAM account:</strong> {samAccount ?? "Caricamento…"} </p>
          </div>
  
          <div className="border rounded-xl p-6 bg-slate-800 shadow-xl">
            <p className="text-slate-300">Qui verrà renderizzata la tua interfaccia di chat…</p>
          </div>
        </main>
      </div>
    </>
  );
}

// Disabilita SSR per MSAL
export default dynamic(() => Promise.resolve(ChatPageInner), { ssr: false });