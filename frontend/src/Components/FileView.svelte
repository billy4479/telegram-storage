<script lang="ts">
  import File from './File.svelte';
  import { getFiles, userFilesStore } from '../Logic/getFiles';

  getFiles();
</script>

<!-- min-w is (min column size)*4 + gap -->
<div
  class="mx-5 grid gap-4 place-items-start justify-items-start min-w-84"
  id="file-view"
>
  {#each $userFilesStore as file}
    <File filename={file.name} id={file.id} />
  {/each}
</div>

<style>
  #file-view {
    grid-template-columns: repeat(auto-fill, minmax(10em, 1fr));
  }
</style>
