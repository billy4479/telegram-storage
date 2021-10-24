<script lang="ts">
  import { files } from '../Logic/apiEndpoints';
  import type { FileEntry } from '../Logic/models';
  import File from './File.svelte';

  async function fetchData(): Promise<FileEntry[]> {
    const res = await fetch(files, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('jwt')}`,
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

<div
  class="mx-5 place-items-center grid gap-4
grid-cols-4 md:grid-cols-6 justify-start"
  id="file-view"
>
  {#await data}
    <div>Loading...</div>
  {:then files}
    {#each files as file}
      <File filename={file.name} url={file.url} />
    {/each}
  {:catch error}
    <div>An error has occurred: {error}</div>
  {/await}
</div>

<style>
  #file-view {
    grid-template-columns: repeat(auto-fit, clamp(7em, auto, 10em));
  }
</style>
