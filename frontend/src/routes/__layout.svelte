<script lang="ts">
  import Overlay from '$comp/Overlays/Overlay.svelte';
  import Error from '$comp/Overlays/Error.svelte';
  import { errorStore } from '$lib/displayError';

  import '../styles.css';
  import { onMount } from 'svelte';

  onMount(() => {
    if (!window.isSecureContext) throw 'No secure context!';
  });

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

<slot />

<Overlay bind:open={showErrorOverlay} bind:close={closeErrorOverlay}>
  <Error close={closeErrorOverlay} />
</Overlay>

<style windi:preflights:global windi:safelist:global>
</style>
