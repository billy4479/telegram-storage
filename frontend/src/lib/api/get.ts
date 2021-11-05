import { checkFetchError, folderEndpoint, genQuery } from './endpoints';
import { authorizationHeader } from './authentication';
import type { Folder } from '../models';

const q = genQuery(folderEndpoint);

export async function getFolder(path: string): Promise<Folder> {
  const p = fetch(q({ path: path }), {
    headers: authorizationHeader(),
  });

  const { ok, message, res } = await checkFetchError(p);
  if (!ok) {
    console.error(message);
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
    console.error(message);
    return Promise.reject(message);
  }

  const result = (await res.json()) as Folder;

  return result;
}