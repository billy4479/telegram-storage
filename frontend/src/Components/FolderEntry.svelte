<script lang="ts">
  import Icon from './Entry.svelte';
  import FolderIcon from 'svelte-icons/md/MdFolder.svelte';

  export let name: string;
  export let id: number;
</script>

<Icon
  {name}
  callback={() => {
    // TODO
    console.log(id);
  }}
>
  <FolderIcon />
</Icon>
