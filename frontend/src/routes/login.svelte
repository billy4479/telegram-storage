<script lang="ts">
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  import { login } from '$lib/api/login';
  import { prefetchSodium } from '$lib/crypto/manager';

  let username = '';
  let password = '';

  async function onSubmit() {
    await login(username, password);
    await goto('/a');
  }

  onMount(prefetchSodium);
</script>

<div class="flex justify-center items-center h-screen">
  <form
    action="/api/login"
    on:submit|preventDefault={onSubmit}
    class="border border-gray-300 inline-block rounded shadow-md bg-gray-50 px-20 py-10"
  >
    <h3 class="text-3xl mb-10">Login</h3>
    <div class="flex flex-col">
      <div>
        <label for="username">Username:</label>
        <input
          type="text"
          name="username"
          placeholder="Telegram username"
          bind:value={username}
        />
      </div>
      <div class="mt-3">
        <label for="password">Password:</label>
        <input
          type="password"
          name="password"
          bind:value={password}
          placeholder="Password"
        />
      </div>

      <p class="py-4">
        Don't have an account yet?
        <a class="text-blue-600 underline" href="/register">Register here</a>.
      </p>

      <input
        type="submit"
        value="Login"
        class="btn-good-light cursor-pointer"
      />
    </div>
  </form>
</div>

<style>
  label {
    @apply mr-3 w-30 inline-block;
  }
</style>
