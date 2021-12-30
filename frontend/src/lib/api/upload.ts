import { getCurrentPath } from '../navigation';
import { checkFetchError, fileEndpoint } from './endpoints';
import { authorizationHeader } from './login';
import { getCryptoManager } from '../crypto/manager';
import { displayError } from '../displayError';

export async function upload(files: FileList): Promise<void> {
  const promises: Promise<void>[] = [];
  for (let i = 0; i < files.length; i++) {
    promises.push(
      (async () => {
        const data = new FormData();
        const file = files.item(i);
        const path = getCurrentPath() + '/' + file.name;

        // This is probably a bug in Typescript library...
        const stream = file.stream() as unknown as ReadableStream<Uint8Array>;

        console.log(`Starting to encrypt ${file.name}`);

        const encrypted = await getCryptoManager()
          .encryptFile(stream)
          .catch((error) => {
            console.error(error);
          });

        if (!encrypted) {
          return;
        }

        console.log(`${file.name} encrypted successfully, starting to upload`);

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

        console.log(`${file.name} uploaded successfully`);
      })()
    );
  }

  await Promise.all(promises);
}
