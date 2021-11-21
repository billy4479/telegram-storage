import { displayError } from '../displayError';
import { authorizationHeader } from './login';
import { checkFetchError } from './endpoints';
import { getCryptoManager } from '../crypto';
import type { FileCryptoData } from '../models';

export default async function authenticatedDownload(
  url: string,
  name: string,
  key: FileCryptoData
) {
  // https://stackoverflow.com/questions/32545632/how-can-i-download-a-file-using-window-fetch
  const p = fetch(url, {
    headers: authorizationHeader(),
  });

  const { ok, message, res } = await checkFetchError(p);
  if (!ok) {
    displayError(message);
    return Promise.reject(message);
  }
  const blob = await getCryptoManager().decryptFile(res.body, key);

  const blobURL = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = blobURL;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
}
