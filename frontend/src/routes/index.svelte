<script lang="ts">
  import { isLoggedIn, isAuthenticatedStore } from '$lib/api/login';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  onMount(() =>
    isLoggedIn().then(async (loggedIn) => {
      if (loggedIn) {
        await goto('/a');
      }
    })
  );
</script>

{#if !$isAuthenticatedStore}
  <h1 class="text-center text-6xl mt-10">Landing page</h1>

  <div class="flex justify-center place-items-center flex-col">
    <p class="mt-10 w-2/3 text-center">
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium nam
      quod repudiandae consequuntur natus quo minus vitae voluptas temporibus
      itaque voluptate assumenda ratione, quibusdam quam cumque dolorem nobis
      aliquid omnis adipisci tempore veniam at? Officiis ad, delectus,
      accusantium nam corporis voluptates iusto saepe molestiae velit ipsum
      modi? Corporis, amet asperiores?
    </p>

    <div class="mt-10">
      <a href="/login" class="btn">Login</a>
      <a href="/register" class="btn btn-primary">Register</a>
    </div>
  </div>
{/if}
