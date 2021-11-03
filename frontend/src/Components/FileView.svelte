<script lang="ts">
  import FileEntry from './FileEntry.svelte';
  import { userFilesStore, getContentOf } from '../Logic/getFiles';
  import FolderEntry from './FolderEntry.svelte';

  getContentOf('/');
</script>

<!-- min-w is (min column size)*4 + gap -->
<div
  class="mx-5 mt-5 grid gap-4 place-items-start justify-items-start min-w-84"
  id="file-view"
>
  {#each $userFilesStore.folders as folder}
    <FolderEntry name={folder.name} id={folder.id} />
  {/each}

  {#each $userFilesStore.files as file}
    <FileEntry filename={file.name} id={file.id} />
  {/each}
</div>

<style>
  #file-view {
    grid-template-columns: repeat(auto-fill, minmax(10em, 1fr));
  }
</style>
