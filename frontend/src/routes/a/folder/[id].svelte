<script lang="ts">
  import { page } from '$app/stores';
  import FileView from '../../../Components/FileView/FileView.svelte';
  import CustomMenu from '../../../Components/RightClickMenu/CustomMenu.svelte';
  import MenuItem from '../../../Components/RightClickMenu/MenuItem.svelte';
  import MenuSeparator from '../../../Components/RightClickMenu/MenuSeparator.svelte';
  import { getFolderByID } from '../../../lib/api/get';
  import MdCreateNewFolder from 'svelte-icons/md/MdCreateNewFolder.svelte';

  let path = '/';
  page.subscribe(async (p) => {
    path = (await getFolderByID(parseInt(p.params.id))).path;
  });
</script>

<FileView bind:path />
<CustomMenu>
  <MenuItem
    text="hey"
    on:click={() => {
      console.log('hey');
    }}
  />
  <MenuSeparator />
  <MenuItem
    text="loooooooooooooooooooong"
    on:click={() => {
      console.log('hey');
    }}
  />
  <MenuItem
    text="hey"
    on:click={() => {
      console.log('hey');
    }}
    disabled={true}
  >
    <MdCreateNewFolder slot="icon" />
  </MenuItem>
</CustomMenu>
