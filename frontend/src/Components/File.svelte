<script lang="ts">
  import { getJWT } from '../Logic/authentication';

  import { download } from '../Logic/apiEndpoints';

  import FileIcon from './FileIcon.svelte';

  export let filename: string;
  export let id: number;

  async function downloadFile() {
    // https://stackoverflow.com/questions/32545632/how-can-i-download-a-file-using-window-fetch
    const res = await fetch(`${download}/${id}`, {
      headers: {
        Authorization: `Bearer ${getJWT()}`,
      },
    });

    const blob = await res.blob();

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }
</script>

<button
  class="border border-gray-300 
         inline-block rounded shadow-md
         bg-gray-50 hover:bg-gray-100
         focus:bg-gray-100 w-full
         overflow-hidden flex justify-center items-stretch"
  title={filename}
  on:click={downloadFile}
>
  <div class="grid place-items-center gap-4 p-3">
    <div class="text-center block">
      <FileIcon />
    </div>
    <span class="text-center">
      {filename}
    </span>
  </div>
</button>

<style>
  span {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    width: 95%;
  }
  button {
    aspect-ratio: 1;
  }
</style>
