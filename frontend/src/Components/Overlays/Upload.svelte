<script lang="ts">
  import { refreshCurrentView } from '$lib/navigation';
  import { upload } from '$lib/api/upload';
  import UploadIcon from 'svelte-icons/md/MdFileUpload.svelte';

  export let close: () => void;

  let inputFiles: HTMLInputElement;

  function resetAndClose() {
    (inputFiles.parentElement as HTMLFormElement).reset();
    close();
  }

  function send() {
    upload(inputFiles.files).finally(refreshCurrentView);
    resetAndClose();
  }
</script>

<h1 class="text-3xl mb-10">Upload</h1>

<form class="form-control">
  <div class="flex justify-center">
    <label class="label btn btn-accent px-3 gap-2" for="file">
      <div class="w-7">
        <UploadIcon />
      </div>
      <span class="text-lg">Browse</span>
    </label>
  </div>
  <input
    type="file"
    name="file"
    id="file"
    class="hidden"
    multiple
    bind:this={inputFiles}
    on:change={send}
  />
  <div class="modal-action">
    <!-- <input type="submit" value="Upload" class="btn btn-primary" /> -->
    <button class="btn btn-error" on:click|preventDefault={close}>Cancel</button
    >
  </div>
</form>
