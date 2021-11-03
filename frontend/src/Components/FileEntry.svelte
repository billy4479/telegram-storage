<script lang="ts">
  import { downloadEndpoint } from '../Logic/apiEndpoints';
  import FileIcon from 'svelte-icons/md/MdInsertDriveFile.svelte';
  import authenticatedDownload from '../Logic/download';
  import Icon from './Entry.svelte';
  import type { File } from '../Logic/models';

  export let data: File;

  async function downloadFile() {
    await authenticatedDownload(`${downloadEndpoint}/${data.id}`, data.name);
  }
</script>

<Icon name={data.name} callback={downloadFile}>
  <FileIcon />
</Icon>
