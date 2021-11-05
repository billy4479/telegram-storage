<script lang="ts">
  import Login from './Components/Login.svelte';
  import { checkAuth, isAuthenticatedStore } from './lib/api/authentication';
  import Main from './Components/Main.svelte';
  import Overlay from './Components/Overlays/Overlay.svelte';
  import Error from './Components/Overlays/Error.svelte';
  import { errorStore } from './lib/displayError';

  let showErrorOverlay: () => void;
  let closeErrorOverlay: () => void;
  let isShown = false;

  errorStore.subscribe((v) => {
    if (!isShown && v !== '') {
      showErrorOverlay();
    }
    isShown = v !== '';
  });
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

<Overlay bind:open={showErrorOverlay} bind:close={closeErrorOverlay}>
  <Error close={closeErrorOverlay} />
</Overlay>

<style>
</style>
