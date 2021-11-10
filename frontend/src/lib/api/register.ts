import { keyStore } from '../crypto';
import { displayError } from '../displayError';
import { checkFetchError, registerEndpoint } from './endpoints';

export async function register(token: string, password: string) {
  await keyStore.deriveMasterKey(password);
  keyStore.deriveAuthKey();
  keyStore.generateEncryptionKey();
  keyStore.encryptEncryptionKey();

  const p = fetch(registerEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jwt: token,
      authKey: keyStore.toBase64(keyStore.authKey),
      encKey: keyStore.toBase64(keyStore.encryptedEncKey),
    }),
  });

  const { res, ok, message } = await checkFetchError(p);
  if (!ok) {
    displayError(message);
    return Promise.reject(message);
  }

  console.log(await res.json());
}
