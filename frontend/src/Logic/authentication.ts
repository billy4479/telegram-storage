import { loginEndpoint } from './apiEndpoints';
import { writable } from 'svelte/store';

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

  const res = await fetch(loginEndpoint, {
    headers: authorizationHeader(),
  });

  if (!res.ok) {
    sessionStorage.removeItem('jwt');
  }

  isAuthenticatedStore.set(res.ok);
  return res.ok;
}

export async function authenticate(userSecret: string) {
  const res = await fetch(loginEndpoint, {
    method: 'POST',
    body: JSON.stringify({ userSecret }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  sessionStorage.setItem('jwt', (await res.json()).token);
  isAuthenticatedStore.set(true);
}

export function logout() {
  sessionStorage.removeItem('jwt');
  isAuthenticatedStore.set(false);
}
