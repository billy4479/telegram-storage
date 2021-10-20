<script lang="ts">
  import FileIcon from './FileIcon.svelte';

  export let filename: string;
  export let url: string;
</script>

<button
  class="border border-gray-300 
         inline-block rounded shadow-md
         bg-gray-50 hover:bg-gray-100
         focus:bg-gray-100 relative w-full"
  title={filename}
>
  <a href={url} target="_blank">
    <div class="grid place-items-center gap-4">
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
  }
  button {
    aspect-ratio: 1;
  }
</style>
