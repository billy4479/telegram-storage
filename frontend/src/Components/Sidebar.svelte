<script lang="ts">
  import UploadIcon from 'svelte-icons/md/MdCloudUpload.svelte';
  // import DownloadIcon from 'svelte-icons/md/MdCloudDownload.svelte';
  import LogoutIcon from 'svelte-icons/io/IoIosLogOut.svelte';
  import TrashIcon from 'svelte-icons/io/IoMdTrash.svelte';
  import NavButton from './NavButton.svelte';
  import { logout } from '../Logic/authentication';
  import Upload from './Upload.svelte';

  let showOverlay = false;
</script>

<nav class="flex flex-col bg-blue-400 fixed top-0 left-0 h-screen w-20">
  <NavButton overlayHint="Logout" callback={logout}>
    <LogoutIcon />
  </NavButton>
  <NavButton
    overlayHint="Upload"
    callback={() => {
      showOverlay = true;
    }}
  >
    <UploadIcon />
  </NavButton>
  <!-- <NavButton overlayHint="Download">
    <DownloadIcon />
  </NavButton> -->
</nav>

{#if showOverlay}
  <Upload
    close={() => {
      showOverlay = !showOverlay;
    }}
  />
{/if}

<style>
</style>
