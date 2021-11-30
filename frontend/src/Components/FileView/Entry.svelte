<script lang="ts">
  export let name: string;
  export let selected = false;

  export let onClick = () => {};
  export let onDoubleClick = () => {};

  let bgStyle = '';
  let buttonStyle = '';

  $: ((selected) => {
    console.log(selected);

    bgStyle = selected ? 'bg-selected' : 'bg-unselected';
    buttonStyle = selected ? 'btn-selected' : 'btn-unselected';
  })(selected);
</script>

<button
  class="border border-gray-300 
           inline-block rounded shadow-md
           w-full overflow-hidden 
           flex flex-col items-stretch
           {buttonStyle}"
  title={name}
  on:click={onClick}
  on:dblclick={onDoubleClick}
>
  <div class="flex-grow flex justify-center items-center {bgStyle}">
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
  .bg-selected {
    @apply bg-blue-50;
  }
  .bg-unselected {
    @apply bg-gray-100;
  }
  .btn-selected {
    @apply bg-blue-200 text-blue-500 font-bold;
  }
  .btn-unselected {
    @apply bg-gray-50 hover:bg-gray-100 focus:bg-gray-100;
  }
</style>
