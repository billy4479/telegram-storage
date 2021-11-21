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
    console.warn(message);
    logout();
  } else {
    CryptoManager.fromMasterKey(getMasterKey());
  }

  isAuthenticatedStore.set(ok);
  return ok;
}

const q = genQuery(userEndpoint);
interface User {
  userID: number;
  username: string;
  masterKeySalt: string;

  shareKeyPublic: string;
  shareKeyPrivate: string;
  shareKeyNonce: string;
}

interface LoginResponse {
  token: string;
  user: User;
}

export async function login(username: string, password: string) {
  const user = await (async (): Promise<User> => {
    const pSalt = fetch(q({ username }));
    const { ok, message, res } = await checkFetchError(pSalt);
    if (!ok) {
      displayError(message);
      return Promise.reject(message);
    }

    return (await res.json()) as User;
  })();

  const manager = await CryptoManager.fromPasswordAndSalt(
    password,
    user.masterKeySalt
  );

  const authKey = manager.getAuthKey();

  const p = fetch(loginEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username,
      authKey: authKey,
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
