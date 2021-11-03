<script lang="ts">
  import Icon from './Entry.svelte';
  import FolderIcon from 'svelte-icons/md/MdFolder.svelte';
  import type { Folder } from '../../Logic/models';
  import { navigate } from '../../Logic/navigate';

  export let data: Folder;
</script>

<Icon
  name={data.name}
  callback={() => {
    navigate(data.path);
  }}
>
  <FolderIcon />
</Icon>
