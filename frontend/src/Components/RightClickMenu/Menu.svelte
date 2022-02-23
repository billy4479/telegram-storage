<script lang="ts">
  // https://svelte.dev/repl/3a33725c3adb4f57b46b597f9dade0c1?version=3.25.0

  import { setContext, createEventDispatcher } from 'svelte';
  import { ctx } from './menuContext';
  export let pos: { x: number; y: number };
  let x = 0,
    y = 0;

  let menuEl: HTMLElement;
  $: ((pos) => {
    if (!menuEl) return;

    x = pos.x;
    y = pos.y;

    const rect = menuEl.getBoundingClientRect();

    // const parentRect = menuEl.parentElement.getBoundingClientRect();
    // x = Math.min(parentRect.right - rect.width, x);

    // Still not exactly as I wanted it, but I'm satisfied with this for now

    if (x > window.innerWidth - rect.width) x -= rect.width;
    if (y > window.innerHeight - rect.height) y -= rect.height;

    x += window.scrollX;
    y += window.scrollY;
  })(pos);

  const dispatch = createEventDispatcher();

  setContext(ctx, {
    dispatchClick: () => dispatch('click'),
  });

  function onPageClick(e: MouseEvent) {
    const t = e.target as HTMLElement;

    if (t === menuEl || menuEl.contains(t)) return;
    dispatch('clickoutside');
  }
</script>

<svelte:body on:click={onPageClick} />

<div
  class="absolute flex flex-col bg-base-200 rounded shadow-lg select-none py-2 w-max"
  bind:this={menuEl}
  style="top: {y}px; left: {x}px;"
>
  <slot />
</div>
