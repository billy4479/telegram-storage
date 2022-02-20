<script lang="ts">
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  import { login } from '$lib/api/login';
  import { prefetchSodium } from '$lib/crypto/manager';

  let username = '';
  let password = '';

  function onSubmit() {
    login(username, password).then(() => goto('/a'));
  }

  onMount(prefetchSodium);
</script>

<svelte:head>
  <title>Login - TelegramStorage</title>
</svelte:head>

<div class="flex justify-center items-center md:h-screen h-auto">
  <form
    action="/api/login"
    on:submit|preventDefault={onSubmit}
    class="form-control md:shadow-lg p-10 md:rounded md:border w-full 
    md:max-w-lg h-full md:h-auto shadow-none border-0"
  >
    <h3 class="text-3xl mb-5">Login</h3>
    <label class="label" for="username">
      <span class="label-text">Username</span>
    </label>
    <input
      type="text"
      placeholder="Telegram username"
      class="input input-bordered"
      bind:value={username}
    />
    <label class="label" for="password">
      <span class="label-text">Password</span>
    </label>
    <input
      type="password"
      placeholder="Password"
      class="input input-bordered"
      bind:value={password}
    />

    <p class="py-4">
      Don't have an account yet?
      <a class="link link-primary" href="/register">Register here</a>
    </p>

    <input type="submit" value="Login" class="btn btn-primary" />
  </form>
</div>
