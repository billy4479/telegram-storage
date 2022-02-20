<script lang="ts" context="module">
  export const enum EntryType {
    Folder,
    File,
  }
</script>

<script lang="ts">
  import FileIcon from 'svelte-icons/md/MdInsertDriveFile.svelte';
  import FolderIcon from 'svelte-icons/md/MdFolder.svelte';

  export let name: string;
  export let selected = false;
  export let type: EntryType;

  export let onClick = () => {};
  export let onDoubleClick = () => {};
</script>

<button
  title={name}
  on:click|stopPropagation={onClick}
  on:dblclick={onDoubleClick}
  class={`btn ${
    selected ? 'btn-info' : 'btn-outline'
  } normal-case h-auto aspect-square flex-col`}
>
  <div class="w-2/3">
    {#if type === EntryType.File}
      <FileIcon />
    {:else if type === EntryType.Folder}
      <FolderIcon />
    {/if}
  </div>
  <span
    class="whitespace-nowrap break-all text-ellipsis text-center py-3 overflow-hidden"
  >
    {name}
  </span>
</button>

<style>
  span {
    max-width: 5rem;
  }
</style>
