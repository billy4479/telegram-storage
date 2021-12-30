<script lang="ts">
  import HomeIcon from 'svelte-icons/md/MdHome.svelte';
  import ArrowForwardIcon from 'svelte-icons/md/MdArrowForward.svelte';
  import ArrowBackIcon from 'svelte-icons/md/MdArrowBack.svelte';
  import RefreshIcon from 'svelte-icons/md/MdRefresh.svelte';

  import Path from './Path.svelte';
  import TopBarButton from './TopBarButton.svelte';
  import { navigate, refreshCurrentView } from '$lib/navigation';
  import { dirStackBack, dirStackForward } from '$lib/directoryStack';
  import { goto } from '$app/navigation';
</script>

<nav class="flex bg-gray-100 rounded shadow py-1 px-2 mb-5 h-14 gap-2">
  <!-- Back -->
  <TopBarButton
    onClick={() => {
      navigate(dirStackBack()).then((r) => goto(r));
    }}
  >
    <ArrowBackIcon />
  </TopBarButton>

  <!-- Forward -->
  <TopBarButton
    onClick={() => {
      navigate(dirStackForward()).then((r) => goto(r));
    }}
  >
    <ArrowForwardIcon />
  </TopBarButton>

  <TopBarButton onClick={refreshCurrentView}>
    <RefreshIcon />
  </TopBarButton>

  <!-- Home -->
  <TopBarButton
    onClick={() => {
      navigate('/').then((r) => goto(r));
    }}
  >
    <HomeIcon />
  </TopBarButton>

  <!-- Path -->
  <Path />
</nav>
