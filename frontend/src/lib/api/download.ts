import { displayError } from '../displayError';
import { authorizationHeader } from './login';
import { checkFetchError, downloadEndpoint, genQuery } from './endpoints';
import { getCryptoManager } from '../cryptoManager';

const q = genQuery(downloadEndpoint);

export default async function authenticatedDownload(
  id: number,
  name: string,
  iv: string,
  key: string
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

  const decryptedFile = await getCryptoManager()
    .decryptFile(await res.arrayBuffer(), iv, key)
    .catch((err: Error) => {
      displayError(err.message);
    });

  if (!decryptedFile) {
    return;
  }

  // Are we copying the whole thing here?
  const blobURL = URL.createObjectURL(await new Response(decryptedFile).blob());
  const a = document.createElement('a');
  a.href = blobURL;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
}
