<script lang="ts">
  import UploadIcon from 'svelte-icons/md/MdCloudUpload.svelte';
  // import DownloadIcon from 'svelte-icons/md/MdCloudDownload.svelte';
  import LogoutIcon from 'svelte-icons/io/IoIosLogOut.svelte';
  import NavButton from './NavButton.svelte';
  import { logout } from '../Logic/authentication';
</script>

<nav class="flex flex-col bg-blue-400 fixed top-0 left-0 h-screen w-20">
  <NavButton overlayHint="Logout" callback={logout}>
    <LogoutIcon />
  </NavButton>
  <NavButton overlayHint="Upload">
    <UploadIcon />
  </NavButton>
  <!-- <NavButton overlayHint="Download">
    <DownloadIcon />
  </NavButton> -->
</nav>

<style>
</style>
