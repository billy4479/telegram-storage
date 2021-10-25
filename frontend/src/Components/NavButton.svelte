<script lang="ts">
  export let callback = () => {};
  export let overlayHint = '';
</script>

<button on:click={callback} title={overlayHint}>
  <div
    class="m-2 bg-blue-500 rounded-2xl p-3 text-light-50 shadow
    focus:bg-blue-400 hover:bg-blue-400"
  >
    <slot />
  </div>
</button>
