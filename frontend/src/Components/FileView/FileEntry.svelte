<script lang="ts">
  import authenticatedDownload from '$lib/api/download';
  import type { File } from '$lib/models';
  import Entry from './Entry.svelte';
  import FileIcon from 'svelte-icons/md/MdInsertDriveFile.svelte';
  import { isSelected, selectedStore, toggle } from '$lib/selection';

  export let data: File;
  let selected = isSelected(data);

  selectedStore.subscribe(() => {
    selected = isSelected(data);
  });

  async function downloadFile() {
    await authenticatedDownload(
      data.fileID,
      data.name,
      data.header,
      data.key,
      data.nonce
    );
  }

  function onClick() {
    selected = toggle(data);
  }
</script>

<Entry name={data.name} bind:selected {onClick} onDoubleClick={downloadFile}>
  <FileIcon />
</Entry>
