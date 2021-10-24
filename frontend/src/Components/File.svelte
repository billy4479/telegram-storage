<script lang="ts">
  import FileIcon from './FileIcon.svelte';

  export let filename: string;
  export let url: string;

  const name = filename.slice(0, filename.lastIndexOf('.'));
</script>

<button
  class="border border-gray-300 
         inline-block rounded shadow-md
         bg-gray-50 hover:bg-gray-100
         focus:bg-gray-100 w-full
         overflow-hidden"
  title={filename}
>
  <a href={url} download={name} class="flex justify-center items-stretch">
    <div class="grid place-items-center gap-4 p-3">
      <div class="text-center block">
        <FileIcon />
      </div>
      <span class="text-center">
        {filename}
      </span>
    </div>
  </a>
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
