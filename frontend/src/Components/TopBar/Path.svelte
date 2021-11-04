<script lang="ts">
  import { currentPathStore, navigate } from '../../Logic/navigate';

  let path = '/';
  let dirs = ['/', ...path.split('/').filter((v) => v != '')];

  currentPathStore.subscribe((v) => {
    path = v;
    dirs = ['/', ...path.split('/').filter((v) => v != '')];
  });

  function navigateToIndex(i: number) {
    let path = dirs
      .slice(0, i + 1)
      .join('/')
      .slice(1, undefined);
    if (path === '') path = '/';
    navigate(path);
  }
</script>

<ol class="flex flex-row mb-5 text-xl bg-gray-100 rounded shadow py-1 px-2">
  {#each dirs as dir, i}
    <li class="bg-gray-50 rounded shadow m-1">
      <button
        class="px-2 py-1 w-full h-full"
        on:click={() => {
          navigateToIndex(i);
        }}
      >
        {dir}
      </button>
    </li>
    {#if i != 0 && i != dirs.length - 1}
      <li class="bg-gray-50 rounded shadow m-1 px-2 py-1 cursor-default">/</li>
    {/if}
  {/each}
</ol>

<style>
</style>
