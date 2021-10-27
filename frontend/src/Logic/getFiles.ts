import { writable } from 'svelte/store';
import { filesEndpoint } from './apiEndpoints';
import { getJWT } from './authentication';
import type { FileEntry } from './models';

const userFilesStore = writable<FileEntry[]>([]);

async function getFiles(): Promise<FileEntry[]> {
  const res = await fetch(filesEndpoint, {
    headers: {
      Authorization: `Bearer ${getJWT()}`,
    },
  });
  if (!res.ok) {
    return Promise.reject('Invalid response');
  }
  const result = (await res.json()) as FileEntry[];

  if (!result) {
    return Promise.reject('Invalid response');
  }
  userFilesStore.set(result);
  return result;
}

export { userFilesStore, getFiles };
