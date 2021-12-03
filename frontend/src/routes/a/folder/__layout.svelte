<script lang="ts">
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  import Sidebar from '../../../Components/Sidebar/Sidebar.svelte';
  import TopBar from '../../../Components/TopBar/TopBar.svelte';
  import { isAuthenticatedStore, isLoggedIn } from '../../../lib/api/login';

  onMount(async () => {
    const p = isLoggedIn().catch(() => {});
    if (!(await p)) goto('/login');
  });
</script>

{#if $isAuthenticatedStore}
  <Sidebar />

  <main class="ml-25 mr-5 mt-5 h-screen">
    <TopBar />
    <slot />
  </main>
{/if}
