<script lang="ts">
  import authenticatedDownload from '$lib/api/download';
  import type { File } from '$lib/models';
  import { isSelected, selectedStore, toggle } from '$lib/selection';
  import Entry, { EntryType } from './Entry.svelte';

  export let data: File;
  let selected = isSelected(data);

  selectedStore.subscribe(() => {
    selected = isSelected(data);
  });

  function downloadFile() {
    console.log(`Starting download of ${data.name}`);

    authenticatedDownload(data.fileID, data.name, data.iv, data.key);
  }

  function onClick() {
    selected = toggle(data);
  }
</script>

<Entry
  name={data.name}
  bind:selected
  {onClick}
  onDoubleClick={downloadFile}
  type={EntryType.File}
/>
