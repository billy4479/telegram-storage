<script lang="ts">
  import FileEntry from './FileEntry.svelte';
  import FolderEntry from './FolderEntry.svelte';
  import {
    currentPathStore,
    getContentOf,
    setRefreshFn,
  } from '../../lib/navigation';
  import type { FolderContent } from '../../lib/models';
  import { pushDirHist } from '../../lib/directoryStack';
  import { clearSelection } from '../../lib/selection';

  export let path = '/';
  let content: FolderContent | undefined;
  $: {
    content = undefined;
    function refresh() {
      content = undefined;
      getContentOf(path).then((c) => (content = c));
    }

    pushDirHist(path);
    currentPathStore.set(path);

    setRefreshFn(refresh);
    refresh();
  }
</script>

{#if content === undefined}
  <div>Loading...</div>
{:else}
  <!-- min-w is (min column size)*4 + gap -->
  <div
    class="grid gap-4 place-items-start justify-items-start min-w-84 h-full"
    id="file-view"
    on:click={clearSelection}
  >
    {#each content.folders as folder}
      <FolderEntry data={folder} />
    {/each}

    {#each content.files as file}
      <FileEntry data={file} />
    {/each}
  </div>
{/if}

<style scoped>
  #file-view {
    grid-template-columns: repeat(auto-fill, minmax(10em, 1fr));
  }
</style>
