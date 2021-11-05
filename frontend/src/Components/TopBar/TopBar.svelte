<script lang="ts">
  import HomeIcon from 'svelte-icons/md/MdHome.svelte';
  import ArrowForwardIcon from 'svelte-icons/md/MdArrowForward.svelte';
  import ArrowBackIcon from 'svelte-icons/md/MdArrowBack.svelte';

  import Path from './Path.svelte';
  import TopBarButton from './TopBarButton.svelte';
  import { navigate } from '../../lib/navigation';
  import { dirStackBack, dirStackForward } from '../../lib/directoryStack';
</script>

<nav class="flex bg-gray-100 rounded shadow py-1 px-2 mb-5 h-14 gap-2">
  <!-- Back -->
  <TopBarButton
    onClick={() => {
      dirStackBack();
    }}
  >
    <ArrowBackIcon />
  </TopBarButton>

  <!-- Forward -->
  <TopBarButton
    onClick={() => {
      dirStackForward();
    }}
  >
    <ArrowForwardIcon />
  </TopBarButton>

  <!-- Home -->
  <TopBarButton
    onClick={() => {
      navigate('/');
    }}
  >
    <HomeIcon />
  </TopBarButton>

  <!-- Path -->
  <Path />
</nav>
