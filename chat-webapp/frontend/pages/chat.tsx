import dynamic from 'next/dynamic';
import { useMsal, useIsAuthenticated } from '@azure/msal-react';
import { InteractionStatus, InteractionRequiredAuthError } from '@azure/msal-browser';
import { loginRequest, getMsalInstance } from '../msal';
import { useEffect, useState } from 'react';

function ChatPageInner() {
  const msalInstance = getMsalInstance();
  const { accounts, inProgress, instance } = useMsal();
  const isAuthenticated = useIsAuthenticated();

  const [samAccount, setSamAccount] = useState<string | null>(null);
  const [givenName, setGivenName] = useState<string | null>(null);
  const [surname, setSurname] = useState<string | null>(null);

  useEffect(() => {
    if (!msalInstance) return;
    if (inProgress === InteractionStatus.None && !isAuthenticated) {
      const attempted = sessionStorage.getItem('msal_login_attempted');
      if (attempted !== 'true') {
        sessionStorage.setItem('msal_login_attempted', 'true');
        msalInstance.loginRedirect(loginRequest).catch(console.error);
      }
    }
  }, [inProgress, isAuthenticated, msalInstance]);

  // Recupera dati da Microsoft Graph
  useEffect(() => {
    if (!isAuthenticated) return;
    if (!accounts[0] || !msalInstance) return;

    const account = accounts[0];

    const fetchGraphData = async () => {
      try {
        const response = await msalInstance.acquireTokenSilent({ ...loginRequest, account });
        const token = response.accessToken;

        const graphResponse = await fetch(
          'https://graph.microsoft.com/v1.0/me?$select=onPremisesSamAccountName,givenName,surname',
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!graphResponse.ok) throw new Error('Graph API error');

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

  if (!isAuthenticated) return <div>Verifica autenticazione…</div>;

  const account = instance.getActiveAccount() ?? accounts[0];

  const handleLogout = () => {
    try {
      sessionStorage.removeItem('msal_login_attempted');
      sessionStorage.removeItem('msal_callback_handled');
    } catch {}
    msalInstance?.logoutRedirect();
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Autenticato correttamente su Azure AD</h1>
      <div className="mt-2">
        <p><strong>Username:</strong> {account?.username}</p>
        <p><strong>Display Name:</strong> {account?.name}</p>
        <p><strong>Given Name:</strong> {givenName ?? 'Caricamento…'}</p>
        <p><strong>Surname:</strong> {surname ?? 'Caricamento…'}</p>
        <p><strong>SAM account:</strong> {samAccount ?? 'Caricamento…'}</p>
      </div>
      <button onClick={handleLogout} className="mt-4 px-4 py-2 bg-gray-700 text-white rounded">
        Logout
      </button>
      <div className="mt-6 border rounded p-4 bg-white shadow">
        <p className="text-gray-600">Qui verrà renderizzata la tua interfaccia di chat…</p>
      </div>
    </div>
  );
}

// Disabilita SSR per MSAL
export default dynamic(() => Promise.resolve(ChatPageInner), { ssr: false });