<script lang="ts">
  import FileView from './Components/FileView.svelte';
  import Login from './Components/Login.svelte';
  import Logout from './Components/Logout.svelte';
  import Sidebar from './Components/Sidebar.svelte';
  import { checkAuth, isAuthenticatedStore } from './Logic/authentication';
</script>

{#await checkAuth()}
  Loading...
{:then}
  {#if !$isAuthenticatedStore}
    <Login />
  {:else}
    <Sidebar />
    <main class="ml-20">
      <Logout />
      <FileView />
    </main>
  {/if}
{/await}

<style>
</style>
