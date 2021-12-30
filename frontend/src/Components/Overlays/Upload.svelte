<script lang="ts">
  import { currentPathStore, refreshCurrentView } from '$lib/navigation';
  import { checkFetchError, fileEndpoint } from '$lib/api/endpoints';
  import { authorizationHeader } from '$lib/api/login';
  import { getCryptoManager } from '$lib/crypto/manager';
  import { displayError } from '$lib/displayError';

  export let close: () => void;

  let inputFiles: HTMLInputElement;
  let currentPath = '/';
  currentPathStore.subscribe((v) => {
    currentPath = v;
  });

  function resetAndClose() {
    refreshCurrentView();
    (inputFiles.parentElement as HTMLFormElement).reset();
    close();
  }

  async function onSubmit() {
    const promises: Promise<void>[] = [];
    for (let i = 0; i < inputFiles.files.length; i++) {
      promises.push(
        (async () => {
          const data = new FormData();

          const path = currentPath + '/' + inputFiles.files[i].name;

          const streamWrong = inputFiles.files[i].stream();
          // console.log(streamWrong);
          // Ehm, wrong type, I think...
          const streamRight =
            streamWrong as unknown as ReadableStream<Uint8Array>;
          // console.log(streamRight);

          console.log(`Starting to encrypt ${inputFiles.files[i].name}`);

          const encrypted = await getCryptoManager()
            .encryptFile(streamRight)
            .catch((error) => {
              console.error(error);
            });

          if (!encrypted) {
            return;
          }

          console.log(
            `${inputFiles.files[i].name} encrypted successfully, starting to upload`
          );

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

          console.log(`${inputFiles.files[i].name} uploaded successfully`);
        })()
      );
    }

    await Promise.all(promises);

    resetAndClose();
  }
</script>

<h1 class="text-3xl mb-10">Upload</h1>

<form on:submit|preventDefault={onSubmit}>
  <input type="file" name="file" id="file" multiple bind:this={inputFiles} />
  <br />
  <div class="flex justify-evenly mt-10">
    <input type="submit" value="Upload" class="btn-good cursor-pointer" />
    <button class="btn-bad-light" on:click|preventDefault={close}>Cancel</button
    >
  </div>
</form>
