import { checkFetchError, folderEndpoint, genQuery } from './endpoints';
import { authorizationHeader } from './login';
import type { Folder } from '../models';
import { displayError } from '../displayError';

const q = genQuery(folderEndpoint);

export async function getFolder(path: string): Promise<Folder> {
  const p = fetch(q({ path: path }), {
    headers: authorizationHeader(),
  });

  const { ok, message, res } = await checkFetchError(p);
  if (!ok) {
    displayError(message);
    return Promise.reject(message);
  }

  const result = (await res.json()) as Folder;

  return result;
}

export async function getFolderByID(id: number): Promise<Folder> {
  const p = fetch(q({ id: id.toString() }), {
    headers: authorizationHeader(),
  });

  const { ok, message, res } = await checkFetchError(p);
  if (!ok) {
    displayError(message);
    return Promise.reject(message);
  }

  const result = (await res.json()) as Folder;

  return result;
}
