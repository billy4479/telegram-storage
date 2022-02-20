<script lang="ts">
  export let callback = () => {};
  export let overlayHint = '';
</script>

<button on:click={callback} title={overlayHint} class="btn btn-accent p-2 my-2">
  <slot />
</button>
