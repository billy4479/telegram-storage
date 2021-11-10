import { checkFetchError, loginEndpoint, registerEndpoint } from './endpoints';
import { writable } from 'svelte/store';
import { displayError } from '../displayError';
import { keyStore } from '../crypto';
import Base64 from 'crypto-js/enc-base64';

function getJWT(): string | null {
  return sessionStorage.getItem('jwt');
}
export const isAuthenticatedStore = writable(false);

export function authorizationHeader(): Headers {
  return new Headers({
    Authorization: 'Bearer ' + getJWT(),
  });
}

let authenticated = false;
isAuthenticatedStore.subscribe((value) => (authenticated = value));
export function isAuthenticated(): boolean {
  return authenticated;
}

export async function checkAuth(): Promise<boolean> {
  if (!getJWT()) {
    return false;
  }

  const p = fetch(loginEndpoint, {
    headers: authorizationHeader(),
  });

  const { ok, message } = await checkFetchError(p);
  if (!ok) {
    displayError(message);
    sessionStorage.removeItem('jwt');
    return Promise.reject(message);
  }

  isAuthenticatedStore.set(ok);
  return ok;
}

export async function authenticate(username: string, password: string) {
  // Generate auth key
  await keyStore.deriveMasterKey(password);
  keyStore.deriveAuthKey();

  const p = fetch(registerEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username,
      authKey: keyStore.toBase64(keyStore.authKey),
    }),
  });

  const { res, ok, message } = await checkFetchError(p);
  if (!ok) {
    displayError(message);
    return Promise.reject(message);
  }

  const j = await res.json();
  keyStore.encryptedEncKey = Base64.parse(j.encKey as string);
  keyStore.decryptEncryptionKey();

  sessionStorage.setItem('jwt', j.token);
  isAuthenticatedStore.set(true);
}

export function logout() {
  sessionStorage.removeItem('jwt');
  isAuthenticatedStore.set(false);
}
