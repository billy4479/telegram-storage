import type { File, Folder } from '../models';
import {
  checkFetchError,
  fileEndpoint,
  folderEndpoint,
  genQuery,
} from './endpoints';
import { authorizationHeader } from './login';
import { displayError } from '../displayError';

const qFile = genQuery(fileEndpoint);
const qFolder = genQuery(folderEndpoint);

export async function deleteFile(file: File) {
  const p = fetch(qFile({ id: file.fileID.toString() }), {
    method: 'DELETE',
    headers: authorizationHeader(),
  });

  const { ok, message } = await checkFetchError(p);
  if (!ok) {
    displayError(message);
    return Promise.reject(message);
  }
}

export async function deleteFolder(folder: Folder) {
  const p = fetch(qFolder({ id: folder.folderID.toString() }), {
    method: 'DELETE',
    headers: authorizationHeader(),
  });

  const { ok, message } = await checkFetchError(p);
  if (!ok) {
    displayError(message);
    return Promise.reject(message);
  }
}

export async function deleteFolderRecursive(folder: Folder) {
  const p = fetch(
    qFolder({ id: folder.folderID.toString(), recursive: 'yes' }),
    {
      method: 'DELETE',
      headers: authorizationHeader(),
    }
  );

  const { ok, message } = await checkFetchError(p);
  if (!ok) {
    displayError(message);
    return Promise.reject(message);
  }
}
