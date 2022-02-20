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

<h1 class="text-2xl mb-3">Create a new folder</h1>
<form on:submit|preventDefault={submit} class="form-control">
  <label class="label" for="name">Name</label>
  <input
    type="text"
    name="name"
    bind:value={name}
    autocomplete="off"
    class="input shadow border"
    placeholder="Folder name"
  />

  <div class="modal-action">
    <input type="submit" value="Create" class="btn btn-primary" />
    <button class="btn btn-error" on:click|preventDefault={close}>Cancel</button
    >
  </div>
</form>
