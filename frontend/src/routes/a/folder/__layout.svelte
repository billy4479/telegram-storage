<script lang="ts">
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  import Sidebar from '$comp/Sidebar/Sidebar.svelte';
  import TopBar from '$comp/TopBar/TopBar.svelte';
  import { isAuthenticatedStore, isLoggedIn } from '$lib/api/login';
  import UploadProgressDashboard from '$comp/UploadProgress/UploadProgressDashboard.svelte';
  import { currentPathStore } from '$lib/navigation';

  onMount(async () => {
    if (!window.isSecureContext) throw 'No secure context!';

    const p = isLoggedIn().catch(() => {});
    if (!(await p)) goto('/login');
  });
</script>

<svelte:head>
  <title
    >{$currentPathStore === '/' ? 'Home' : $currentPathStore.split('/').at(-1)} -
    TelegramStorage
  </title>
</svelte:head>

{#if $isAuthenticatedStore}
  <Sidebar />

  <main class="ml-16 flex flex-col h-screen">
    <TopBar />
    <slot />
  </main>

  <UploadProgressDashboard />
{/if}
