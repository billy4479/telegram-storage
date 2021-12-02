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
  class="px-6 py-2 flex gap-4 cursor-pointer
  hover:bg-gray-200 focus:bg-gray-200 h-10"
  class:disabled
  on:click={handleClick}
>
  {#if $$slots.icon}
    <span>
      <slot name="icon" />
    </span>
  {/if}
  <span>
    {#if text}
      {text}
    {/if}
  </span>
</div>

<style>
  div.disabled {
    @apply text-gray-500 hover:bg-light-50 focus:bg-light-50 cursor-default;
  }
</style>
