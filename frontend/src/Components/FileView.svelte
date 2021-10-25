<script lang="ts">
  import { getJWT } from '../Logic/authentication';
  import { files } from '../Logic/apiEndpoints';
  import type { FileEntry } from '../Logic/models';
  import File from './File.svelte';

  async function fetchData(): Promise<FileEntry[]> {
    const res = await fetch(files, {
      headers: {
        Authorization: `Bearer ${getJWT()}`,
      },
    });
    if (!res.ok) {
      return Promise.reject('Invalid response');
    }
    const result = (await res.json()) as FileEntry[];

    if (!result) {
      return Promise.reject('Invalid response');
    }
    return result;
  }

  let data = fetchData();
</script>

<!-- min-w is (min column size)*4 + gap -->
<div
  class="mx-5 grid gap-4 place-items-start justify-items-start min-w-84"
  id="file-view"
>
  {#await data}
    <div>Loading...</div>
  {:then files}
    {#each files as file}
      <File filename={file.name} id={file.id} />
    {/each}
  {:catch error}
    <div>An error has occurred: {error}</div>
  {/await}
</div>

<style>
  #file-view {
    grid-template-columns: repeat(auto-fill, minmax(10em, 1fr));
  }
</style>
