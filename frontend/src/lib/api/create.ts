import { displayError } from '../displayError';
import type { Folder } from '../models';
import { authorizationHeader } from './authentication';
import { checkFetchError, folderEndpoint } from './endpoints';

export async function createFolder(path: string): Promise<Folder> {
  const headers = authorizationHeader();
  headers.append('Content-Type', 'application/json');

  console.log(headers);

  const p = fetch(folderEndpoint, {
    method: 'POST',
    body: JSON.stringify({ path }),
    headers,
  });

  const { ok, message, res } = await checkFetchError(p);
  if (!ok) {
    displayError(message);
    return Promise.reject(message);
  }

  const result = (await res.json()) as Folder;

  return result;
}
