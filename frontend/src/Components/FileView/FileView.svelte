<script lang="ts">
  import FileEntry from './FileEntry.svelte';
  import FolderEntry from './FolderEntry.svelte';
  import {
    currentPathStore,
    getContentOf,
    setRefreshFn,
  } from '$lib/navigation';
  import type { FolderContent } from '$lib/models';
  import { pushDirHist } from '$lib/directoryStack';

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
  <center class="m-5">Loading...</center>
{:else if content.files.length + content.folders.length == 0}
  <center class="m-5">This folder is empty.</center>
{:else}
  <!-- min-w is (min column size)*4 + gap -->
  <div
    class="grid gap-4 place-items-start justify-items-start mx-3"
    id="file-view"
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
    grid-template-columns: repeat(auto-fill, minmax(7em, 1fr));
  }
</style>
