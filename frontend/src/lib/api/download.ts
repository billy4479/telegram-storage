import { displayError } from '../displayError';
import { authorizationHeader } from './login';
import { checkFetchError, downloadEndpoint, genQuery } from './endpoints';
import { getCryptoManager } from '../crypto/manager';

const q = genQuery(downloadEndpoint);

export default async function authenticatedDownload(
  id: number,
  name: string,
  header: string,
  key: string,
  nonce: string
): Promise<void> {
  // https://stackoverflow.com/questions/32545632/how-can-i-download-a-file-using-window-fetch
  const p = fetch(q({ id: id.toString() }), {
    headers: authorizationHeader(),
  });

  const { ok, message, res } = await checkFetchError(p);
  if (!ok) {
    displayError(message);
    return Promise.reject(message);
  }

  const blob = await getCryptoManager()
    .decryptFile(await res.blob(), header, key, nonce)
    .catch((err: Error) => {
      displayError(err.message);
    });

  if (!blob) {
    return;
  }

  const blobURL = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = blobURL;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
}
