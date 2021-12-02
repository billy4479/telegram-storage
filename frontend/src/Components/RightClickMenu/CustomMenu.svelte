<script lang="ts">
  import Menu from './Menu.svelte';

  let isOpen = false;
  let position = { x: 0, y: 0 };

  function close() {
    isOpen = false;
  }

  function onRightClick(e: MouseEvent): void {
    if (isOpen) {
      close();
      return;
    }

    position = { x: e.clientX, y: e.clientY };

    isOpen = true;
  }
</script>

{#if isOpen}
  <Menu pos={position} on:click={close} on:clickoutside={close}>
    <slot />
  </Menu>
{/if}

<svelte:body on:contextmenu|preventDefault={onRightClick} />
