<script lang="ts">
  import Entry from './Entry.svelte';
  import FolderIcon from 'svelte-icons/md/MdFolder.svelte';
  import type { Folder } from '../../lib/models';
  import { isSelected, selectedStore, toggle } from '../../lib/selection';
  import { goto } from '$app/navigation';
  import { pushDirHist } from '../../lib/directoryStack';
  import { navigate } from '../../lib/navigation';

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
    navigate(pushDirHist(data.path)).then((r) => goto(r));
  }}
  {onClick}
>
  <FolderIcon />
</Entry>
