<script lang="ts">
  import FileView from './FileView/FileView.svelte';
  import Path from './TopBar/Path.svelte';
  import Sidebar from './Sidebar/Sidebar.svelte';
</script>

<Sidebar />
<main class="ml-25 mr-5 mt-5">
  <Path />
  <FileView />
</main>
