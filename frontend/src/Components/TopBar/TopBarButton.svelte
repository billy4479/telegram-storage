<script lang="ts">
  export let onClick: () => void;
</script>

<button on:click={onClick} class="bg-light-50 py-1 px-2 rounded border w-12">
  <slot />
</button>

<style scoped>
  button {
    aspect-ratio: 1;
  }
</style>
