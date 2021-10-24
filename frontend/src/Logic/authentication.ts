import { login } from './apiEndpoints';
import { writable } from 'svelte/store';

function getJWT(): string | null {
  return localStorage.getItem('jwt');
}
const isAuthenticated = writable(false);

async function isAuthValid(): Promise<boolean> {
  if (!getJWT()) {
    return false;
  }

  const res = await fetch(login, {
    headers: {
      Authorization: `Bearer ${getJWT()}`,
    },
  });

  if (!res.ok) {
    localStorage.removeItem('jwt');
  }

  isAuthenticated.set(res.ok);
  return res.ok;
}

async function authenticate(userSecret: string) {
  const res = await fetch(login, {
    method: 'POST',
    body: JSON.stringify({ userSecret }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  localStorage.setItem('jwt', (await res.json()).token);
  isAuthenticated.set(true);
}

function logout() {
  localStorage.removeItem('jwt');
  isAuthenticated.set(false);
}

export { isAuthValid, isAuthenticated, authenticate, getJWT, logout };
