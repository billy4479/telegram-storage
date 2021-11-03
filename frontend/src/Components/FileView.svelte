<script lang="ts">
  import FileEntry from './FileEntry.svelte';
  import FolderEntry from './FolderEntry.svelte';
  import { navigate, currentViewStore } from '../Logic/navigate';

  const n = navigate('/');
</script>

{#await n}
  <div>Loading...</div>
{:then}
  <!-- min-w is (min column size)*4 + gap -->
  <div
    class="grid gap-4 place-items-start justify-items-start min-w-84"
    id="file-view"
  >
    {#each $currentViewStore.folders as folder}
      <FolderEntry data={folder} />
    {/each}

    {#each $currentViewStore.files as file}
      <FileEntry data={file} />
    {/each}
  </div>
{/await}

<style>
  #file-view {
    grid-template-columns: repeat(auto-fill, minmax(10em, 1fr));
  }
</style>
