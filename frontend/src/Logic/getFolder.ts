import { folderEndpoint, genQuery } from './apiEndpoints';
import { authorizationHeader } from './authentication';
import type { Folder } from './models';

const q = genQuery(folderEndpoint);

export async function getFolder(path: string): Promise<Folder> {
  const res = await fetch(q({ path: path }), {
    headers: authorizationHeader(),
  });

  if (!res.ok) {
    return Promise.reject('Invalid response');
  }
  const result = (await res.json()) as Folder;

  if (!result) {
    return Promise.reject('Invalid response');
  }

  return result;
}
