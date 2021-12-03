<script lang="ts">
  import { page } from '$app/stores';
  import FileView from '../../../Components/FileView/FileView.svelte';
  import CustomMenu from '../../../Components/RightClickMenu/CustomMenu.svelte';
  import MenuItem from '../../../Components/RightClickMenu/MenuItem.svelte';
  import MenuSeparator from '../../../Components/RightClickMenu/MenuSeparator.svelte';
  import { getFolderByID } from '../../../lib/api/get';
  import NewFolderIcon from 'svelte-icons/md/MdCreateNewFolder.svelte';
  import UploadIcon from 'svelte-icons/md/MdCloudUpload.svelte';
  import Overlay from '../../../Components/Overlays/Overlay.svelte';
  import Upload from '../../../Components/Overlays/Upload.svelte';
  import Delete from '../../../Components/Overlays/Delete.svelte';
  import CreateFolder from '../../../Components/Overlays/CreateFolder.svelte';

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

<FileView bind:path />
<CustomMenu>
  <MenuItem text="New folder" on:click={showNewFolderOverlay}>
    <NewFolderIcon slot="icon" />
  </MenuItem>
  <MenuItem text="Upload file" on:click={showUploadOverlay}>
    <UploadIcon slot="icon" />
  </MenuItem>
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
