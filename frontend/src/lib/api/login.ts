import {
  checkFetchError,
  genQuery,
  loginEndpoint,
  registerEndpoint,
  userEndpoint,
} from './endpoints';
import { writable } from 'svelte/store';
import { displayError } from '../displayError';
import { CryptoManager } from '../crypto';

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

export function logout() {
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

  const { ok, message } = await checkFetchError(p);
  if (!ok) {
    logout();
    displayError(message);
    return Promise.reject(message);
  }

  return ok;
}

const q = genQuery(userEndpoint);
interface LoginResponse {
  token: string;
  shareKey: {
    pub: string;
    priv: string;
    nonce: string;
  };
}

export async function login(username: string, password: string) {
  let salt: string | undefined;
  {
    const pSalt = fetch(q({ username }));
    const { ok, message, res } = await checkFetchError(pSalt);
    if (!ok) {
      displayError(message);
      return Promise.reject(message);
    }

    salt = (await res.json()).salt;
    if (!salt) {
      const msg = 'Salt not found in the response';
      displayError(msg);
      return Promise.reject(msg);
    }
  }

  const manager = await CryptoManager.fromPasswordAndSalt(password, salt);

  const p = fetch(registerEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username,
      authKey: manager.getAuthKey(),
    }),
  });

  const { res, ok, message } = await checkFetchError(p);
  if (!ok) {
    displayError(message);
    return Promise.reject(message);
  }

  const j = (await res.json()) as LoginResponse;
  manager.setShareKey(j.shareKey.pub, j.shareKey.priv, j.shareKey.nonce);

  sessionStorage.setItem('jwt', j.token);
  sessionStorage.setItem('masterKey', manager.getMasterKey());
  isAuthenticatedStore.set(true);
}
