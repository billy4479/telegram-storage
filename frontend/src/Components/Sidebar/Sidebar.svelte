<script lang="ts">
  // Icons
  import UploadIcon from 'svelte-icons/md/MdCloudUpload.svelte';
  import LogoutIcon from 'svelte-icons/io/IoIosLogOut.svelte';
  import TrashIcon from 'svelte-icons/io/IoMdTrash.svelte';
  import NewFolderIcon from 'svelte-icons/md/MdCreateNewFolder.svelte';

  // Overlays
  import Overlay from '../Overlays/Overlay.svelte';
  import Upload from '../Overlays/Upload.svelte';
  import Delete from '../Overlays/Delete.svelte';
  import CreateFolder from '../Overlays/CreateFolder.svelte';

  import NavButton from './NavButton.svelte';

  import { logout } from '$lib/api/login';
  import { getSelected } from '$lib/selection';
  import { goto } from '$app/navigation';

  let showUploadOverlay: () => void;
  let closeUploadOverlay: () => void;

  let showDeleteOverlay: () => void;
  let closeDeleteOverlay: () => void;

  let showNewFolderOverlay: () => void;
  let closeNewFolderOverlay: () => void;
</script>

<nav class="flex flex-col bg-blue-400 fixed top-0 left-0 h-screen w-20">
  <NavButton overlayHint="New Folder" callback={showNewFolderOverlay}>
    <NewFolderIcon />
  </NavButton>
  <NavButton overlayHint="Upload" callback={showUploadOverlay}>
    <UploadIcon />
  </NavButton>
  <NavButton
    overlayHint="Delete"
    callback={() => {
      if (getSelected().length !== 0) showDeleteOverlay();
    }}
  >
    <TrashIcon />
  </NavButton>
  <div class="mt-auto">
    <NavButton
      overlayHint="Logout"
      callback={async () => {
        await goto('/login');
        logout();
      }}
    >
      <LogoutIcon />
    </NavButton>
  </div>
</nav>

<Overlay bind:close={closeUploadOverlay} bind:open={showUploadOverlay}>
  <Upload close={closeUploadOverlay} />
</Overlay>

<Overlay bind:close={closeDeleteOverlay} bind:open={showDeleteOverlay}>
  <Delete close={closeDeleteOverlay} />
</Overlay>

<Overlay bind:close={closeNewFolderOverlay} bind:open={showNewFolderOverlay}>
  <CreateFolder close={closeNewFolderOverlay} />
</Overlay>
