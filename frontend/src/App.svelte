<script lang="ts">
  import FileView from './Components/FileView.svelte';
  import Login from './Components/Login.svelte';
  import PathBar from './Components/PathBar.svelte';
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
    <main class="ml-25 mr-5 mt-5">
      <PathBar />
      <FileView />
    </main>
  {/if}
{/await}

<style>
</style>
