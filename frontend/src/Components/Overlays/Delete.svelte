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
<br />
<ul class="list-disc pl-7 py-3 bg-base-200 rounded shadow">
  {#each $selectedStore as entry}
    <li>
      {entry.name}
    </li>
  {/each}
</ul>
<br />

<label class="label">
  Enable recursive deleting
  <input
    name="recursive"
    type="checkbox"
    class="checkbox"
    bind:checked={recursive}
  />
</label>

<div class="modal-action">
  <button class="btn btn-error" on:click={executeDelete}>Yes, delete</button>
  <button class="btn btn-info" on:click={close}>No, cancel</button>
</div>
