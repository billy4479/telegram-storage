<!-- https://github.com/Schum123/svelte-loading-spinners/blob/master/src/Circle.svelte -->
<script lang="ts">
  export let color = '#FF3E00';
</script>

<div class="circle animate-spin " style="--color: {color};" />

<style>
  .circle {
    width: 100%;
    aspect-ratio: 1;
    border-color: var(--color) transparent var(--color) var(--color);
    border-width: 0.25em;
    border-style: solid;
    border-image: initial;
    border-radius: 50%;
  }
</style>
