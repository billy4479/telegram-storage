<script lang="ts">
  export let name: string;
  export let selected = false;

  export let onClick = () => {};
  export let onDoubleClick = () => {};

  function getButtonStyles(s: boolean): string {
    if (s) {
      return 'bg-blue-200 text-blue-500 font-bold';
    }
    return 'bg-gray-50 hover:bg-gray-100 focus:bg-gray-100';
  }

  function getBGStyles(s: boolean): string {
    if (s) {
      return 'bg-blue-50';
    }
    return 'bg-gray-100';
  }
</script>

<button
  class="border border-gray-300 
           inline-block rounded shadow-md
           w-full overflow-hidden 
           flex flex-col items-stretch
           {getButtonStyles(selected)}"
  title={name}
  on:click={onClick}
  on:dblclick={onDoubleClick}
>
  <div
    class="flex-grow flex justify-center items-center {getBGStyles(selected)}"
  >
    <div class="w-1/3">
      <slot />
    </div>
  </div>
  <span class="text-center py-3 px-2">
    {name}
  </span>
</button>

<style scoped>
  span {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  button {
    aspect-ratio: 1;
  }
</style>
