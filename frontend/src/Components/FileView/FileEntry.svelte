<script lang="ts">
  import { downloadEndpoint } from '../../lib/api/endpoints';
  import authenticatedDownload from '../../lib/api/download';
  import type { File } from '../../lib/models';
  import Entry from './Entry.svelte';
  import FileIcon from 'svelte-icons/md/MdInsertDriveFile.svelte';
  import { isSelected, selectedStore, toggle } from '../../lib/selection';

  export let data: File;
  let selected = isSelected(data);

  selectedStore.subscribe(() => {
    selected = isSelected(data);
  });

  async function downloadFile() {
    await authenticatedDownload(
      `${downloadEndpoint}/${data.fileID}`,
      data.name,
      data.key
    );
  }

  function onClick() {
    selected = toggle(data);
  }
</script>

<Entry name={data.name} bind:selected {onClick} onDoubleClick={downloadFile}>
  <FileIcon />
</Entry>
