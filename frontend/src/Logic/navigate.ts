import { writable } from 'svelte/store';
import { genQuery, listEndpoint } from './apiEndpoints';
import { authorizationHeader } from './authentication';
import { getFolder } from './getFolder';
import type { FolderContent } from './models';

export const currentViewStore = writable<FolderContent>({
  files: [],
  folders: [],
});

export const currentPathStore = writable<string>('/');
let currentPath = '/';
currentPathStore.subscribe((v) => {
  currentPath = v;
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
  return result;
}

export async function navigate(to: string) {
  console.log('Navigating to ' + to + '...');

  currentViewStore.set(await getContentOf(to));
  currentPathStore.set(to);
}

export async function refreshCurrentView() {
  console.log('Refreshing view');

  currentViewStore.set(await getContentOf(currentPath));
}
