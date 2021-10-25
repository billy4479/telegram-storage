<script lang="ts">
  import Overlay from './Overlay.svelte';

  export let close: () => void;

  function onSubmit() {
    close();
  }
</script>

<Overlay>
  <h1 class="text-3xl mb-10">Upload</h1>

  <form on:submit|preventDefault={onSubmit}>
    <input type="file" name="file" id="file" multiple />
    <br />
    <div class="flex justify-evenly mt-10">
      <input
        type="submit"
        value="Upload"
        class="py-2 px-3 rounded shadow bg-green-500 text-light-50"
      />
      <button
        class="py-2 px-3 rounded shadow bg-red-500 text-light-50"
        on:click={close}>Cancel</button
      >
    </div>
  </form>
</Overlay>
