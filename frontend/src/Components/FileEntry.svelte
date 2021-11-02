<script lang="ts">
  import { downloadEndpoint } from '../Logic/apiEndpoints';
  import FileIcon from 'svelte-icons/md/MdInsertDriveFile.svelte';
  import authenticatedDownload from '../Logic/download';
  import Icon from './Entry.svelte';

  export let filename: string;
  export let id: number;

  async function downloadFile() {
    await authenticatedDownload(`${downloadEndpoint}/${id}`, filename);
  }
</script>

<Icon name={filename} callback={downloadFile}>
  <FileIcon />
</Icon>
