<script lang="ts">
  import { downloadEndpoint } from '../../Logic/apiEndpoints';
  import authenticatedDownload from '../../Logic/download';
  import type { File } from '../../Logic/models';
  import Icon from './Entry.svelte';
  import FileIcon from 'svelte-icons/md/MdInsertDriveFile.svelte';

  export let data: File;

  async function downloadFile() {
    await authenticatedDownload(`${downloadEndpoint}/${data.id}`, data.name);
  }
</script>

<Icon name={data.name} callback={downloadFile}>
  <FileIcon />
</Icon>
