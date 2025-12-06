import dynamic from "next/dynamic";
import Head from "next/head";
import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { InteractionStatus, InteractionRequiredAuthError } from "@azure/msal-browser";
import { loginRequest, getMsalInstance } from "../msal";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Chat from "../components/Chat";

function ChatPageInner() {
  const msalInstance = getMsalInstance();
  const { accounts, inProgress, instance } = useMsal();
  const isAuthenticated = useIsAuthenticated();

  const [samAccount, setSamAccount] = useState<string | null>(null);
  const [givenName, setGivenName] = useState<string | null>(null);
  const [surname, setSurname] = useState<string | null>(null);

  const [messages, setMessages] = useState<{ id: string; text: string; sent: boolean }[]>([]);
  const [inputText, setInputText] = useState("");

  /** Login automatico se non autenticato */
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

  /** Recupera dati utente da Microsoft Graph */
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

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen text-slate-200">
        Verifica autenticazione…
      </div>
    );
  }

  const account = instance.getActiveAccount() ?? accounts[0];

  const handleLogout = () => {
    try {
      sessionStorage.removeItem("msal_login_attempted");
      sessionStorage.removeItem("msal_callback_handled");
    } catch {}
    msalInstance?.logoutRedirect();
  };

  const handleSend = () => {
    if (!inputText.trim()) return;
    setMessages([...messages, { id: Date.now().toString(), text: inputText, sent: true }]);
    setInputText("");
  };

  return (
    <>
      <Head>
        <title>Chat - AI Platform</title>
      </Head>
      <div className="flex h-screen bg-slate-900">
        {/* Sidebar */}
        <aside className="h-full border-r border-slate-700 flex flex-col justify-between">
          <div className="h-full text-slate-200 text-sm">
            <Sidebar
              givenName={givenName}
              surname={surname}
              samAccount={samAccount}
              username={account?.username}
              onLogout={handleLogout}
            />
          </div>
        </aside>

        {/* Area principale */}
        <main className="flex-1 flex flex-col">
          <Chat
            messages={messages}
            inputText={inputText}
            setInputText={setInputText}
            onSend={handleSend}
          />
        </main>
      </div>
    </>
  );
}

export default dynamic(() => Promise.resolve(ChatPageInner), { ssr: false });