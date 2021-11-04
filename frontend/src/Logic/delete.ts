import type { File, Folder } from './models';
import { fileEndpoint, folderEndpoint, genQuery } from './apiEndpoints';
import { authorizationHeader } from './authentication';

const qFile = genQuery(fileEndpoint);
const qFolder = genQuery(folderEndpoint);

export async function deleteFile(file: File) {
  await fetch(qFile({ id: file.fileID.toString() }), {
    method: 'DELETE',
    headers: authorizationHeader(),
  });
}

export async function deleteFolder(folder: Folder) {
  await fetch(qFolder({ id: folder.folderID.toString() }), {
    method: 'DELETE',
    headers: authorizationHeader(),
  });
}

export async function deleteFolderRecursive(folder: Folder) {
  await fetch(qFolder({ id: folder.folderID.toString(), recursive: 'yes' }), {
    method: 'DELETE',
    headers: authorizationHeader(),
  });
}
