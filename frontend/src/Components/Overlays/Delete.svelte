<script lang="ts">
  import { deleteSelected, selectedStore } from '$lib/selection';

  export let close: () => void;
  let recursive = false;

  function executeDelete() {
    deleteSelected(recursive);
    recursive = false;
    close();
  }
</script>

<h1 class="text-3xl mb-3">Are you sure?</h1>
<p>The following files are going to be deleted:</p>
<ul class="list-disc ml-5">
  {#each $selectedStore as entry}
    <li>
      {entry.name}
    </li>
  {/each}
</ul>
<br />
<label for="recursive">Enable recursive deleting</label>
<input name="recursive" type="checkbox" bind:checked={recursive} />

<div class="flex place-items-center justify-evenly mt-5">
  <button class="btn-bad" on:click={executeDelete}>Yes, delete</button>
  <button class="btn-neutral-light" on:click={close}>No, cancel</button>
</div>
