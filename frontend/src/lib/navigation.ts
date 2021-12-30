import { genQuery, listEndpoint } from './api/endpoints';
import type { Folder, FolderContent } from './models';
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

export async function navigate(to: string): Promise<string> {
  clearSelection();
  currentPathStore.set(to);
  pushDirHist(to);
  return `/a/folder/${(await getFolder(to)).folderID}`;
}

export function navigateToFolder(to: Folder): string {
  clearSelection();
  currentPathStore.set(to.path);
  pushDirHist(to.path);
  return `/a/folder/${to.folderID}`;
}

let currentRefreshFn: () => void;
export function setRefreshFn(refreshFn: () => void): void {
  currentRefreshFn = refreshFn;
}

export async function refreshCurrentView(): Promise<void> {
  clearSelection();
  currentRefreshFn();
}
