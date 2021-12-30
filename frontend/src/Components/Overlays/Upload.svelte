<script lang="ts">
  import { refreshCurrentView } from '$lib/navigation';
  import { upload } from '$lib/api/upload';

  export let close: () => void;

  let inputFiles: HTMLInputElement;

  function resetAndClose() {
    (inputFiles.parentElement as HTMLFormElement).reset();
    close();
  }

  function onSubmit() {
    upload(inputFiles.files).finally(refreshCurrentView);
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
