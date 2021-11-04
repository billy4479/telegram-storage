<script lang="ts">
  import { downloadEndpoint } from '../../Logic/apiEndpoints';
  import authenticatedDownload from '../../Logic/download';
  import type { File } from '../../Logic/models';
  import Entry from './Entry.svelte';
  import FileIcon from 'svelte-icons/md/MdInsertDriveFile.svelte';
  import { isSelected, selectedStore, toggle } from '../../Logic/selection';

  export let data: File;
  let selected = isSelected(data);

  selectedStore.subscribe(() => {
    selected = isSelected(data);
  });

  async function downloadFile() {
    await authenticatedDownload(
      `${downloadEndpoint}/${data.fileID}`,
      data.name
    );
  }

  function onClick() {
    selected = toggle(data);
  }
</script>

<Entry name={data.name} bind:selected {onClick} onDoubleClick={downloadFile}>
  <FileIcon />
</Entry>
