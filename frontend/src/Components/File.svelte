<script lang="ts">
  import { download } from '../Logic/apiEndpoints';
  import FileIcon from 'svelte-icons/md/MdInsertDriveFile.svelte';
  import authenticatedDownload from '../Logic/download';

  export let filename: string;
  export let id: number;

  async function downloadFile() {
    await authenticatedDownload(`${download}/${id}`, filename);
  }
</script>

<button
  class="border border-gray-300 
         inline-block rounded shadow-md
         bg-gray-50 hover:bg-gray-100
         focus:bg-gray-100 w-full
         overflow-hidden flex flex-col items-stretch"
  title={filename}
  on:click={downloadFile}
>
  <div class="flex-grow flex justify-center items-center bg-gray-100">
    <div class="w-1/3">
      <FileIcon />
    </div>
  </div>
  <span class="text-center py-3">
    {filename}
  </span>
</button>

<style>
  span {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  button {
    aspect-ratio: 1;
  }
</style>
