import { getCurrentPath } from '../navigation';
import { checkFetchError, fileEndpoint } from './endpoints';
import { authorizationHeader } from './login';
import { getCryptoManager } from '../crypto/manager';
import { displayError } from '../displayError';
import { writable } from 'svelte/store';

export const enum UploadStatus {
  Waiting,
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

const MAX_CONCURRENT_UPLOADS = 3;
const BATCH_DELAY = 3 * 1000;

async function singleUpload(
  file: File,
  path: string,
  key: symbol
): Promise<void> {
  const data = new FormData();

  uploadStore.update((v) => {
    v[key].status = UploadStatus.Encrypting;
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
}

export async function upload(files: FileList): Promise<void> {
  const l = files.length;
  const batches = Math.ceil(l / MAX_CONCURRENT_UPLOADS);

  for (let batch = 0; batch < batches; batch++) {
    const promises: Promise<void>[] = [];

    for (let i = 0; i < MAX_CONCURRENT_UPLOADS; i++) {
      const index = batch * MAX_CONCURRENT_UPLOADS + i;
      if (index >= l) break;

      const file = files[index];
      const path = getCurrentPath() + '/' + file.name;
      const k = Symbol();
      uploadStore.update((v) => {
        v[k] = {
          name: file.name,
          status: UploadStatus.Waiting,
        };
        return v;
      });
      promises.push(singleUpload(file, path, k));
    }

    // FIXME: I don't think this is enough to avoid being rate limited...
    //        https://core.telegram.org/bots/faq#my-bot-is-hitting-limits-how-do-i-avoid-this
    //        > Also note that your bot will not be able to send more
    //        > than 20 messages per minute to the same group.
    promises.push(
      new Promise(function (resolve) {
        setTimeout(resolve, BATCH_DELAY);
      })
    );
    await Promise.all(promises);
  }
}
