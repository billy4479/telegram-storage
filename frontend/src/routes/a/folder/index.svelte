<script lang="ts">
  import { goto } from '$app/navigation';

  import { onMount } from 'svelte';
  import { getFolder } from '$lib/api/get';

  onMount(async () =>
    getFolder('/').then((root) => {
      goto(`/a/folder/${root.folderID}`);
    })
  );
</script>
