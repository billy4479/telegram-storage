<script lang="ts">
  export let name: string;
  export let callback: () => void;
</script>

<button
  class="border border-gray-300 
           inline-block rounded shadow-md
           bg-gray-50 hover:bg-gray-100
           focus:bg-gray-100 w-full
           overflow-hidden flex flex-col items-stretch"
  title={name}
  on:click={callback}
>
  <div class="flex-grow flex justify-center items-center bg-gray-100">
    <div class="w-1/3">
      <slot />
    </div>
  </div>
  <span class="text-center py-3 px-2">
    {name}
  </span>
</button>

<style>
  span {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  button {
    aspect-ratio: 1;
  }
</style>
