<script lang="ts">
  import Login from './Components/Login.svelte';
  import { checkAuth, isAuthenticatedStore } from './Logic/authentication';
  import Main from './Components/Main.svelte';
</script>

{#await checkAuth()}
  Loading...
{:then}
  {#if !$isAuthenticatedStore}
    <Login />
  {:else}
    <Main />
  {/if}
{/await}

<style>
</style>
