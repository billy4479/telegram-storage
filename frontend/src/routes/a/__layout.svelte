<script lang="ts">
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  import Sidebar from '../../Components/Sidebar/Sidebar.svelte';
  import { isAuthenticatedStore } from '../../lib/api/login';

  onMount(() => {
    isAuthenticatedStore.subscribe((v) => {
      if (!v) goto('/login');
    });
  });
</script>

{#if $isAuthenticatedStore}
  <Sidebar />

  <main class="ml-25 mr-5 mt-5">
    <slot />
  </main>
{/if}
