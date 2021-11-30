<script lang="ts">
  import { page } from '$app/stores';
  import FileView from '../../../Components/FileView/FileView.svelte';
  import { getFolderByID } from '../../../lib/api/get';

  let path = '/';
  page.subscribe(async (p) => {
    path = (await getFolderByID(parseInt(p.params.id))).path;
  });
</script>

<FileView bind:path />
