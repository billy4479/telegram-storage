<script lang="ts">
  export let name: string;
  export let selected = false;

  export let onClick = () => {};
  export let onDoubleClick = () => {};

  let bgStyle = '';
  let buttonStyle = '';

  $: ((selected) => {
    bgStyle = selected ? 'bg-selected' : 'bg-unselected';
    buttonStyle = selected ? 'btn-selected' : 'btn-unselected';
  })(selected);
</script>

<!-- class="border border-gray-300 
         rounded shadow-md
         w-full overflow-hidden 
         flex flex-col items-stretch
         {buttonStyle}" -->
<button
  title={name}
  on:click|stopPropagation={onClick}
  on:dblclick={onDoubleClick}
  class={`btn ${
    selected ? 'btn-info' : 'btn-outline'
  } normal-case h-auto aspect-square flex-col`}
>
  <div class="w-2/3">
    <slot />
  </div>
  <div class="text-center py-3 px-2">
    {name}
  </div>
</button>
