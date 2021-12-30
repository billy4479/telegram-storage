<script lang="ts">
  import { createFolder } from '$lib/api/create';
  import { getCurrentPath, refreshCurrentView } from '$lib/navigation';
  let name = '';
  export let close: () => void;

  async function submit() {
    await createFolder(getCurrentPath() + '/' + name);
    refreshCurrentView();
    close();
  }
</script>

<h1 class="text-2xl">Create a new folder</h1>
<form on:submit|preventDefault={submit}>
  <div class="my-5">
    <label for="name">Name</label>
    <input
      type="text"
      name="name"
      bind:value={name}
      autocomplete="off"
      class="ml-3 py-1 px-2 border shadow"
    />
  </div>

  <div class="flex place-items-center justify-evenly mt-5">
    <input type="submit" value="Create" class="btn-good" />
    <button class="btn-bad-light" on:click|preventDefault={close}>Cancel</button
    >
  </div>
</form>
