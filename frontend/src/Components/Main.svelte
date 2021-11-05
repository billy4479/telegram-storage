<script lang="ts">
  import FileView from './FileView/FileView.svelte';
  import Sidebar from './Sidebar/Sidebar.svelte';
  import TopBar from './TopBar/TopBar.svelte';
</script>

<Sidebar />
<main class="ml-25 mr-5 mt-5">
  <TopBar />
  <FileView />
</main>
