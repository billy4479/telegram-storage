<script lang="ts">
  import File from './File.svelte';
  import type { FileEntry } from './models';

  async function fetchData(): Promise<FileEntry[]> {
    const res = await fetch('/api/files', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('jwt')}`,
      },
    });
    return (await res.json()) as FileEntry[];
  }

  let data = fetchData();
</script>

<main
  class="place-items-center grid gap-4
grid-cols-4 md:grid-cols-6 justify-start"
>
  {#await data}
    <div>Loading...</div>
  {:then files}
    {#each files as file}
      <File filename={file.name} url={file.url} />
    {/each}
  {:catch error}
    <div>An error has occurred: {error.message}</div>
  {/await}
</main>

<style>
  main {
    grid-template-columns: repeat(auto-fit, minmax(7em, auto));
  }
</style>
