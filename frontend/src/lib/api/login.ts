import {
  checkFetchError,
  genQuery,
  loginEndpoint,
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
  user: {
    userID: number;

    shareKeyPublic: string;
    shareKeyPrivate: string;
    shareKeyNonce: string;
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

  const p = fetch(loginEndpoint, {
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

  const responseData = (await res.json()) as LoginResponse;
  manager.setShareKey(
    responseData.user.shareKeyPublic,
    responseData.user.shareKeyPrivate,
    responseData.user.shareKeyNonce
  );

  sessionStorage.setItem('jwt', responseData.token);
  sessionStorage.setItem('masterKey', manager.getMasterKey());
  isAuthenticatedStore.set(true);
}
