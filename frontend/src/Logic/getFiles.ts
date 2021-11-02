import { writable } from 'svelte/store';
import { filesEndpoint } from './apiEndpoints';
import { authorizationHeader } from './authentication';
import type { FolderContent } from './models';

export const userFilesStore = writable<FolderContent>({
  files: [],
  folders: [],
});

export async function getContentOf(path: string): Promise<FolderContent> {
  const res = await fetch(filesEndpoint, {
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
