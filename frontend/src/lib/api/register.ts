import { CryptoManager } from '../cryptoManager';
import { displayError } from '../displayError';
import type { User } from '../models';
import { checkFetchError, registerEndpoint } from './endpoints';
import { authenticateWithKey } from './login';

export async function register(token: string, password: string): Promise<void> {
  const { cryptoManager, registrationData } = await CryptoManager.newUser(
    password
  );

  const p = fetch(registerEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jwt: token,
      keys: await registrationData,
    }),
  });

  const { res, ok, message } = await checkFetchError(p);
  if (!ok) {
    displayError(message);
    return Promise.reject(message);
  }

  const user = (await res.json()) as User;

  // manager.setShareKey(
  //   userData.shareKeyPrivate,
  //   userData.shareKeyPrivate,
  //   userData.shareKeyNonce
  // );

  await authenticateWithKey(user.username, cryptoManager);
}
