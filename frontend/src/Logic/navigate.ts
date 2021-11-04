import { genQuery, listEndpoint } from './apiEndpoints';
import type { FolderContent } from './models';
import { authorizationHeader } from './authentication';
import { clearSelection } from './selection';
import { getFolder } from './getFolder';
import { writable } from 'svelte/store';

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

  const res = await fetch(q({ id: folder.folderID.toString() }), {
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

  clearSelection();
  currentViewStore.set(await getContentOf(to));
  currentPathStore.set(to);
}

export async function refreshCurrentView() {
  console.log('Refreshing view');

  clearSelection();
  currentViewStore.set(await getContentOf(currentPath));
}
