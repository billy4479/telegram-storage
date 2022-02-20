<script lang="ts">
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  import Sidebar from '$comp/Sidebar/Sidebar.svelte';
  import TopBar from '$comp/TopBar/TopBar.svelte';
  import { isAuthenticatedStore, isLoggedIn } from '$lib/api/login';
  import UploadProgressDashboard from '$comp/UploadProgress/UploadProgressDashboard.svelte';

  onMount(async () => {
    if (!window.isSecureContext) throw 'No secure context!';

    const p = isLoggedIn().catch(() => {});
    if (!(await p)) goto('/login');
  });
</script>

{#if $isAuthenticatedStore}
  <Sidebar />

  <main class="ml-16">
    <TopBar />
    <slot />
  </main>

  <UploadProgressDashboard />
{/if}
