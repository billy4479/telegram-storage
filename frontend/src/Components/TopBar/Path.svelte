<script lang="ts">
  import { currentPathStore, navigate } from '../../lib/navigation';

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

<ol class="flex bg-light-50 px-2 rounded border text-2xl place-items-center">
  {#each dirs as dir, i}
    <li>
      <button
        class="hover:underline"
        on:click={() => {
          navigateToIndex(i);
        }}
      >
        {#if i != 0 && i != dirs.length - 1}
          {dir}/
        {:else}
          {dir}
        {/if}
      </button>
    </li>
  {/each}
</ol>

<style>
</style>
