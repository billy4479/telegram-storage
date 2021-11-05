import { checkFetchError, loginEndpoint } from './endpoints';
import { writable } from 'svelte/store';
import { displayError } from '../displayError';

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

export async function authenticate(userSecret: string) {
  const p = fetch(loginEndpoint, {
    method: 'POST',
    body: JSON.stringify({ userSecret }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const { ok, message, res } = await checkFetchError(p);
  if (!ok) {
    displayError(message);
    return Promise.reject(message);
  }

  sessionStorage.setItem('jwt', (await res.json()).token);
  isAuthenticatedStore.set(true);
}

export function logout() {
  sessionStorage.removeItem('jwt');
  isAuthenticatedStore.set(false);
}
