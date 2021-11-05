<script lang="ts">
  export let close: () => void;
  export let open: () => void;

  let isOpen = false;

  close = () => {
    isOpen = false;
  };
  open = () => {
    isOpen = true;
  };
</script>

{#if isOpen}
  <div
    class="fixed top-0 left-0 h-screen w-screen bg-dark-700 opacity-70 flex place-items-center justify-center z-10"
  />
  <div
    class="fixed top-0 left-0 h-screen w-screen flex place-items-center justify-center z-20"
  >
    <div class="p-10 max-w-4/5 opacity-100 bg-light-100 rounded-xl text-lg">
      <slot />
    </div>
  </div>
{/if}

<style>
</style>
