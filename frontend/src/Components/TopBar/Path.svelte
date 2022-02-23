<script lang="ts">
  import { goto } from '$app/navigation';
  import { currentPathStore, navigate } from '$lib/navigation';
  import HomeIcon from 'svelte-icons/md/MdHome.svelte';

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
    navigate(path).then((r) => goto(r));
  }
</script>

<div class="navbar-center breadcrumbs ">
  <ul>
    {#each dirs as dir, i}
      <li>
        <button
          class="link"
          on:click={() => {
            navigateToIndex(i);
          }}
        >
          {#if i == 0}
            <div class="cursor-pointer p-1 w-8">
              <HomeIcon />
            </div>
          {:else if i != dirs.length - 1}
            {dir}/
          {:else}
            {dir}
          {/if}
        </button>
      </li>
    {/each}
  </ul>
</div>
