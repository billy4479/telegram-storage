<script lang="ts">
  import File from './File.svelte';
  import type { FileEntry } from './models';

  const res = `
    [
        {"url": "https://www.google.com", "name": "Google"},
        {"url": "https://www.google.com", "name": "Google"},
        {"url": "https://www.google.com", "name": "Google"},
        {"url": "https://www.google.com", "name": "Google"},
        {"url": "https://www.google.com", "name": "Google"}
    ]`;

  const files: FileEntry[] = JSON.parse(res);
</script>

<main
  class="place-items-center grid gap-4
grid-cols-4 md:grid-cols-6"
>
  {#each files as file}
    <File filename={file.name} url={file.url} />
  {/each}
</main>

<style>
  main {
    grid-template-columns: repeat(auto-fit, minmax(7em, auto));
  }
</style>
