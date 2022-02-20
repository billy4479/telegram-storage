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

<nav
  class="navbar bg-base-200 rounded-lg w-auto shadow-md py-1 px-2 mx-3 mt-3 mb-5 gap-2"
>
  <!-- Actions -->
  <div class="navbar-start">
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
  </div>

  <!-- Path -->
  <Path />
</nav>
