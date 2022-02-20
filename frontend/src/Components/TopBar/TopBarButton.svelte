<script lang="ts">
  export let onClick: () => void;
</script>

<button on:click={onClick} class="btn btn-ghost p-2">
  <slot />
</button>

<style scoped>
  button {
    aspect-ratio: 1;
  }
</style>
