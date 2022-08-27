import {
  checkFetchError,
  genQuery,
  loginEndpoint,
  userEndpoint,
} from './endpoints';
import { writable } from 'svelte/store';
import { displayError } from '../displayError';
import type { User } from '../models';
import { CryptoManager } from '../cryptoManager';

function getJWT(): string | null {
  return sessionStorage.getItem('jwt');
}

function getMasterKey(): string | null {
  return sessionStorage.getItem('masterKey');
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

export function logout(): void {
  sessionStorage.removeItem('jwt');
  sessionStorage.removeItem('masterKey');
  isAuthenticatedStore.set(false);
}

export async function isLoggedIn(): Promise<boolean> {
  if (!getJWT() || !getMasterKey()) {
    return false;
  }

  const p = fetch(loginEndpoint, {
    headers: authorizationHeader(),
  });

  const r = await checkFetchError(p).catch(() => {
    logout();
  });

  if (!r) {
    return false;
  }

  const { ok, message } = r;

  if (!ok) {
    console.warn(message);
    logout();
  } else {
    CryptoManager.fromMasterKey(getMasterKey());
  }

  isAuthenticatedStore.set(ok);
  return ok;
}

const q = genQuery(userEndpoint);

interface LoginResponse {
  token: string;
  user: User;
}

export async function authenticateWithKey(
  username: string,
  manager: CryptoManager
): Promise<void> {
  const p = fetch(loginEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username,
      authKey: await manager.getAuthKey(),
    }),
  });

  const { res, ok, message } = await checkFetchError(p);
  if (!ok) {
    displayError(message);
    return Promise.reject(message);
  }

  const responseData = (await res.json()) as LoginResponse;
  manager.importShareKeys(
    responseData.user.shareKeyPublic,
    responseData.user.shareKeyPrivate
  );

  sessionStorage.setItem('jwt', responseData.token);
  sessionStorage.setItem('masterKey', await manager.getMasterKey());
  isAuthenticatedStore.set(true);
}

export async function login(username: string, password: string): Promise<void> {
  const p = fetch(q({ username }));
  const { ok, message, res } = await checkFetchError(p);
  if (!ok) {
    displayError(message);
    return Promise.reject(message);
  }

  const user = (await res.json()) as User;

  const manager = await CryptoManager.fromPasswordAndSalt(
    password,
    user.masterKeySalt
  );

  await authenticateWithKey(username, manager);
}
