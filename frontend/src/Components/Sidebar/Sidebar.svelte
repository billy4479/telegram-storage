<script lang="ts">
  import Overlay from '../Overlays/Overlay.svelte';
  import UploadIcon from 'svelte-icons/md/MdCloudUpload.svelte';
  // import DownloadIcon from 'svelte-icons/md/MdCloudDownload.svelte';
  import LogoutIcon from 'svelte-icons/io/IoIosLogOut.svelte';
  import TrashIcon from 'svelte-icons/io/IoMdTrash.svelte';
  import NavButton from './NavButton.svelte';
  import { logout } from '../../Logic/authentication';
  import Upload from '../Overlays/Upload.svelte';
  import { deleteSelected } from '../../Logic/selection';

  let showUploadOverlay: () => void;
  let closeUploadOverlay: () => void;
</script>

<nav class="flex flex-col bg-blue-400 fixed top-0 left-0 h-screen w-20">
  <NavButton overlayHint="Logout" callback={logout}>
    <LogoutIcon />
  </NavButton>
  <NavButton overlayHint="Upload" callback={showUploadOverlay}>
    <UploadIcon />
  </NavButton>
  <NavButton
    overlayHint="Delete"
    callback={() => {
      deleteSelected(false);
    }}
  >
    <TrashIcon />
  </NavButton>
  <!-- <NavButton overlayHint="Download">
    <DownloadIcon />
  </NavButton> -->
</nav>

<Overlay bind:close={closeUploadOverlay} bind:open={showUploadOverlay}>
  <Upload close={closeUploadOverlay} />
</Overlay>

<style>
</style>
