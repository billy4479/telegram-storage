<script lang="ts">
  import FileView from './Components/FileView.svelte';
  import Login from './Components/Login.svelte';
  import Logout from './Components/Logout.svelte';
  import Sidebar from './Components/Sidebar.svelte';
  import { isAuthenticated, isAuthValid } from './Logic/authentication';
</script>

{#await isAuthValid()}
  Loading...
{:then valid}
  {#if !(valid && $isAuthenticated)}
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
