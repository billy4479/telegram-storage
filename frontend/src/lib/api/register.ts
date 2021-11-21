import { CryptoManager } from '../crypto';
import { displayError } from '../displayError';
import { checkFetchError, registerEndpoint } from './endpoints';

export async function register(token: string, password: string) {
  const { keys } = await CryptoManager.createUser(password);

  const p = fetch(registerEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jwt: token,
      keys,
    }),
  });

  const { res, ok, message } = await checkFetchError(p);
  if (!ok) {
    displayError(message);
    return Promise.reject(message);
  }

  console.log(await res.json());
}
