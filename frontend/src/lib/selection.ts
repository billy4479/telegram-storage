import type { File, Folder } from './models';
import { deleteFile, deleteFolder, deleteFolderRecursive } from './api/delete';
import { refreshCurrentView } from './navigation';
import { writable } from 'svelte/store';

export const selectedStore = writable<(File | Folder)[]>([]);
let selected: (File | Folder)[] = [];
selectedStore.subscribe((v) => {
  selected = v;
});

export function getSelected(): (File | Folder)[] {
  return selected;
}

export function isSelected(entry: File | Folder): boolean {
  return selected.includes(entry);
}

export function toggle(entry: File | Folder): boolean {
  const result = !isSelected(entry);

  selectedStore.update((v) => {
    if (result) {
      v.push(entry);
    } else {
      v = v.filter((e) => e !== entry);
    }
    return v;
  });

  return result;
}

export function clearSelection() {
  selectedStore.set([]);
}

export function deleteSelected(recursive: boolean) {
  selected.forEach(async (e) => {
    if ((e as File).fileID) {
      await deleteFile(e as File);
    } else {
      if (recursive) await deleteFolderRecursive(e as Folder);
      else await deleteFolder(e as Folder);
    }
  });
  clearSelection();
  setTimeout(refreshCurrentView, 100);
}
