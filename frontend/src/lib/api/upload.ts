import { getCurrentPath } from '../navigation';
import { checkFetchError, fileEndpoint } from './endpoints';
import { authorizationHeader } from './login';
import { getCryptoManager } from '../crypto/manager';
import { displayError } from '../displayError';
import { writable } from 'svelte/store';

export const enum UploadStatus {
  Encrypting,
  Uploading,
  Done,
}

export interface UploadItem {
  name: string;
  status: UploadStatus;
}

export interface UploadStoreType {
  [key: symbol]: UploadItem;
}

export const uploadStore = writable<UploadStoreType>({});

export async function upload(files: FileList): Promise<void> {
  const promises: Promise<void>[] = [];
  for (let i = 0; i < files.length; i++) {
    promises.push(
      (async () => {
        const data = new FormData();
        const file = files.item(i);
        const path = getCurrentPath() + '/' + file.name;
        const key = Symbol();

        uploadStore.update((v) => {
          v[key] = {
            name: file.name,
            status: UploadStatus.Encrypting,
          };
          return v;
        });

        const encrypted = await getCryptoManager()
          .encryptFile(file)
          .catch((error) => {
            displayError(error);
          });

        if (!encrypted) {
          return Promise.reject();
        }

        uploadStore.update((v) => {
          v[key].status = UploadStatus.Uploading;
          return v;
        });

        data.append('file', encrypted.data);
        data.append('path', path);
        data.append('header', encrypted.header);
        data.append('keyEnc', encrypted.key.keyEnc);
        data.append('nonce', encrypted.key.nonce);

        const p = fetch(fileEndpoint, {
          method: 'POST',
          body: data,
          headers: authorizationHeader(),
        });

        const { ok, message } = await checkFetchError(p);
        if (!ok) {
          displayError(message);
          return Promise.reject(message);
        }

        uploadStore.update((v) => {
          v[key].status = UploadStatus.Done;
          return v;
        });
      })()
    );
  }

  await Promise.all(promises);
}
