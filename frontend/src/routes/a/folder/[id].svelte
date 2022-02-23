<script lang="ts">
  import { page } from '$app/stores';

  import NewFolderIcon from 'svelte-icons/md/MdCreateNewFolder.svelte';
  import TrashIcon from 'svelte-icons/io/IoMdTrash.svelte';
  import UploadIcon from 'svelte-icons/md/MdCloudUpload.svelte';

  import { getFolderByID } from '$lib/api/get';
  import { clearSelection, selectedStore } from '$lib/selection';

  import FileView from '$comp/FileView/FileView.svelte';
  import CustomMenu from '$comp/RightClickMenu/CustomMenu.svelte';
  import MenuItem from '$comp/RightClickMenu/MenuItem.svelte';
  import Overlay from '$comp/Overlays/Overlay.svelte';
  import Upload from '$comp/Overlays/Upload.svelte';
  import Delete from '$comp/Overlays/Delete.svelte';
  import CreateFolder from '$comp/Overlays/CreateFolder.svelte';

  let path = '/';
  page.subscribe(async (p) => {
    if (p.params.id) path = (await getFolderByID(parseInt(p.params.id))).path;
  });

  let showUploadOverlay: () => void;
  let closeUploadOverlay: () => void;

  let showDeleteOverlay: () => void;
  let closeDeleteOverlay: () => void;

  let showNewFolderOverlay: () => void;
  let closeNewFolderOverlay: () => void;
</script>

<div class="flex-1" on:click={clearSelection}>
  <FileView bind:path />
</div>

<CustomMenu>
  {#if $selectedStore.length === 0}
    <MenuItem text="New folder" on:click={showNewFolderOverlay}>
      <NewFolderIcon slot="icon" />
    </MenuItem>
    <MenuItem text="Upload file" on:click={showUploadOverlay}>
      <UploadIcon slot="icon" />
    </MenuItem>
  {:else}
    <MenuItem text="Delete" on:click={showDeleteOverlay}>
      <TrashIcon slot="icon" />
    </MenuItem>
  {/if}
</CustomMenu>

<Overlay bind:close={closeUploadOverlay} bind:open={showUploadOverlay}>
  <Upload close={closeUploadOverlay} />
</Overlay>

<Overlay bind:close={closeDeleteOverlay} bind:open={showDeleteOverlay}>
  <Delete close={closeDeleteOverlay} />
</Overlay>

<Overlay bind:close={closeNewFolderOverlay} bind:open={showNewFolderOverlay}>
  <CreateFolder close={closeNewFolderOverlay} />
</Overlay>
