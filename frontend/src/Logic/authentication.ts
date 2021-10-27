import { loginEndpoint } from './apiEndpoints';
import { writable } from 'svelte/store';

function getJWT(): string | null {
  return sessionStorage.getItem('jwt');
}
const isAuthenticatedStore = writable(false);

let authenticated = false;
isAuthenticatedStore.subscribe((value) => (authenticated = value));
function isAuthenticated(): boolean {
  return authenticated;
}

async function checkAuth(): Promise<boolean> {
  if (!getJWT()) {
    return false;
  }

  const res = await fetch(loginEndpoint, {
    headers: {
      Authorization: `Bearer ${getJWT()}`,
    },
  });

  if (!res.ok) {
    sessionStorage.removeItem('jwt');
  }

  isAuthenticatedStore.set(res.ok);
  return res.ok;
}

async function authenticate(userSecret: string) {
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

function logout() {
  sessionStorage.removeItem('jwt');
  isAuthenticatedStore.set(false);
}

export {
  checkAuth,
  isAuthenticatedStore,
  authenticate,
  getJWT,
  logout,
  isAuthenticated,
};
