<script lang="ts">
  import FileView from './FileView.svelte';
</script>

<FileView />

<style global type="text/postcss">
  @tailwind base;
  @tailwind components;
  @tailwind utilities;

  body {
    width: 85%;
    margin: 5% auto;
    text-align: center;
  }
</style>
