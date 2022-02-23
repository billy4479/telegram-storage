<script lang="ts">
  import { getContext } from 'svelte';
  import { createEventDispatcher } from 'svelte';
  import { ctx } from './menuContext';

  export let text: string;
  export let disabled = false;

  const dispatch = createEventDispatcher();

  const { dispatchClick } = getContext(ctx);

  const handleClick = () => {
    if (disabled) return;

    dispatch('click');
    dispatchClick();
  };
</script>

<div
  class="px-6 py-2 gap-4 btn btn-ghost flex h-10 justify-start"
  class:btn-disabled={disabled}
  on:click={handleClick}
>
  {#if $$slots.icon}
    <div class="w-6">
      <slot name="icon" />
    </div>
  {/if}
  <span>
    {#if text}
      {text}
    {/if}
  </span>
</div>
