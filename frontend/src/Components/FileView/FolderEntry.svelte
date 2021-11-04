<script lang="ts">
  import Entry from './Entry.svelte';
  import FolderIcon from 'svelte-icons/md/MdFolder.svelte';
  import type { Folder } from '../../Logic/models';
  import { navigate } from '../../Logic/navigate';
  import { isSelected, selectedStore, toggle } from '../../Logic/selection';

  export let data: Folder;
  let selected = isSelected(data);
  selectedStore.subscribe(() => {
    selected = isSelected(data);
  });

  function onClick() {
    selected = toggle(data);
  }
</script>

<Entry
  name={data.name}
  bind:selected
  onDoubleClick={() => {
    navigate(data.path);
  }}
  {onClick}
>
  <FolderIcon />
</Entry>
