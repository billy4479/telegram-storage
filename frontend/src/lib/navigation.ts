import { genQuery, listEndpoint } from './api/endpoints';
import type { FolderContent } from './models';
import { authorizationHeader } from './api/login';
import { clearSelection } from './selection';
import { getFolder } from './api/get';
import { writable } from 'svelte/store';
import { pushDirHist } from './directoryStack';

export const currentViewStore = writable<FolderContent>({
  files: [],
  folders: [],
});

export const currentPathStore = writable<string>('/');
let currentPath = '/';
currentPathStore.subscribe((v) => {
  currentPath = v;
});

export function getCurrentPath(): string {
  return currentPath;
}

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

export async function navigateInternal(to: string): Promise<void> {
  clearSelection();
  currentViewStore.set(await getContentOf(to));
  currentPathStore.set(to);
}

export async function navigate(to: string): Promise<void> {
  await navigateInternal(to);
  pushDirHist(to);
}

export async function refreshCurrentView(): Promise<void> {
  clearSelection();
  currentViewStore.set(await getContentOf(currentPath));
}
