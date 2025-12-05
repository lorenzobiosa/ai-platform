
import type { AppProps } from 'next/app';
import { MsalProvider } from '@azure/msal-react';
import { getMsalInstance } from '../msal';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  const msalInstance = getMsalInstance();
  return msalInstance ? (
    <MsalProvider instance={msalInstance}>
      <Component {...pageProps} />
    </MsalProvider>
  ) : (
    <Component {...pageProps} />
  );
}