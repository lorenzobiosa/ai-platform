import { PublicClientApplication, EventType, AuthenticationResult, LogLevel } from '@azure/msal-browser';

let msalInstance: PublicClientApplication | null = null;

export const getMsalInstance = () => {
  if (msalInstance) return msalInstance;
  if (typeof window === 'undefined') return null;

  const clientId = process.env.NEXT_PUBLIC_CLIENT_ID;
  const tenantId = process.env.NEXT_PUBLIC_TENANT_ID;
  const redirectUri = process.env.NEXT_PUBLIC_REDIRECT_URI;
  const postLogoutUri = process.env.NEXT_PUBLIC_POST_LOGOUT_URI || '/';

  if (!clientId || !tenantId || !redirectUri) {
    throw new Error('Env MSAL mancanti: NEXT_PUBLIC_CLIENT_ID, NEXT_PUBLIC_TENANT_ID, NEXT_PUBLIC_REDIRECT_URI');
  }

  msalInstance = new PublicClientApplication({
    auth: {
      clientId,
      authority: `https://login.microsoftonline.com/${tenantId}`,
      redirectUri,
      postLogoutRedirectUri: postLogoutUri,
      navigateToLoginRequestUrl: false,
    },
    cache: {
      cacheLocation: 'sessionStorage',
      storeAuthStateInCookie: true,
    },
    system: {
      loggerOptions: {
        logLevel: LogLevel.Error,
        piiLoggingEnabled: false,
        loggerCallback: (level, message) => {
          if (process.env.NODE_ENV === 'development') console.debug('[MSAL]', level, message);
        },
      },
    },
  });

  msalInstance.addEventCallback((event) => {
    if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
      const res = event.payload as AuthenticationResult;
      msalInstance?.setActiveAccount(res.account);
      try {
        sessionStorage.removeItem('msal_login_attempted');
        sessionStorage.removeItem('msal_callback_handled');
      } catch {}
    }
  });

  return msalInstance;
};

// Scope aggiornati per leggere onPremisesSamAccountName, givenName e surname
export const loginRequest = { scopes: ['User.Read', 'User.ReadBasic.All'] };