<script lang="ts">
  import Login from '../Components/Login.svelte';
  import { isLoggedIn, isAuthenticatedStore } from '../lib/api/login';
  import Main from '../Components/Main.svelte';
  import Overlay from '../Components/Overlays/Overlay.svelte';
  import Error from '../Components/Overlays/Error.svelte';
  import { errorStore } from '../lib/displayError';
  import Register from '../Components/Register.svelte';

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

{#await isLoggedIn()}
  Loading...
{:then}
  {#if !$isAuthenticatedStore}
    <Register />
    <Login />
  {:else}
    <Main />
  {/if}
{/await}

<Overlay bind:open={showErrorOverlay} bind:close={closeErrorOverlay}>
  <Error close={closeErrorOverlay} />
</Overlay>
