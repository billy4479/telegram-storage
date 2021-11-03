<script lang="ts">
  import { currentPathStore, refreshCurrentView } from '../../Logic/navigate';
  import { fileEndpoint } from '../../Logic/apiEndpoints';
  import { authorizationHeader } from '../../Logic/authentication';
  import Overlay from './Overlay.svelte';

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
    const data = new FormData();
    for (let i = 0; i < inputFiles.files.length; i++) {
      const name = currentPath + '/' + inputFiles.files[i].name;
      const b64 = btoa(name).replaceAll('+', '-').replaceAll('/', '_');

      data.append('files', inputFiles.files[i], b64);
    }

    await fetch(fileEndpoint, {
      method: 'POST',
      body: data,
      headers: authorizationHeader(),
    })
      .then(async (res) => {
        if (!res.ok) {
          console.error(await res.text());
        }
      })
      .catch((err) => console.log(err));

    resetAndClose();
  }
</script>

<Overlay>
  <h1 class="text-3xl mb-10">Upload</h1>

  <form on:submit|preventDefault={onSubmit}>
    <input type="file" name="file" id="file" multiple bind:this={inputFiles} />
    <br />
    <div class="flex justify-evenly mt-10">
      <input
        type="submit"
        value="Upload"
        class="py-2 px-3 rounded shadow bg-green-500 text-light-50 cursor-pointer"
      />
      <button
        class="py-2 px-3 rounded shadow bg-red-500 text-light-50"
        on:click={close}>Cancel</button
      >
    </div>
  </form>
</Overlay>
