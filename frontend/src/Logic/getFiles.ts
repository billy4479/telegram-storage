import { writable } from 'svelte/store';
import { genQuery, listEndpoint } from './apiEndpoints';
import { authorizationHeader } from './authentication';
import { getFolder } from './getFolder';
import type { FolderContent } from './models';

export const userFilesStore = writable<FolderContent>({
  files: [],
  folders: [],
});

const q = genQuery(listEndpoint);

export async function getContentOf(path: string): Promise<FolderContent> {
  const folder = await getFolder(path);

  const res = await fetch(q({ id: folder.id.toString() }), {
    headers: authorizationHeader(),
  });

  if (!res.ok) {
    return Promise.reject('Invalid response');
  }
  const result = (await res.json()) as FolderContent;

  if (!result) {
    return Promise.reject('Invalid response');
  }
  userFilesStore.set(result);
  return result;
}
