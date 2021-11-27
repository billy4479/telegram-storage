<script lang="ts">
  import { goto } from '$app/navigation';

  import Sidebar from '../../Components/Sidebar/Sidebar.svelte';
  import { isAuthenticatedStore } from '../../lib/api/login';

  isAuthenticatedStore.subscribe((v) => {
    if (!v) goto('/login');
  });
</script>

<Sidebar />

<main class="ml-25 mr-5 mt-5">
  <slot />
</main>
