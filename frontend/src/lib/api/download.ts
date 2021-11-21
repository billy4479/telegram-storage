import { displayError } from '../displayError';
import { authorizationHeader } from './login';
import { checkFetchError, downloadEndpoint, genQuery } from './endpoints';
import { getCryptoManager } from '../crypto';

const q = genQuery(downloadEndpoint);

export default async function authenticatedDownload(
  id: number,
  name: string,
  header: string,
  key: string,
  nonce: string
) {
  // https://stackoverflow.com/questions/32545632/how-can-i-download-a-file-using-window-fetch

  const url = q({ id: id.toString() });
  console.log(url);

  const p = fetch(url, {
    method: 'GET',
    headers: authorizationHeader(),
  });

  const { ok, message, res } = await checkFetchError(p);
  if (!ok) {
    displayError(message);
    return Promise.reject(message);
  }

  const blob = await getCryptoManager().decryptFile(
    res.body,
    header,
    key,
    nonce
  );

  const blobURL = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = blobURL;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
}
