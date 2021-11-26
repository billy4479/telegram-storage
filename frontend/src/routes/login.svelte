<script lang="ts">
  import { goto } from '$app/navigation';

  import { login } from '../lib/api/login';

  let username = '';
  let password = '';

  async function onSubmit() {
    await login(username, password);
    await goto('/');
  }
</script>

<div class="flex justify-center items-center mt-10">
  <form
    action="/api/login"
    on:submit|preventDefault={onSubmit}
    class="border border-gray-300 inline-block rounded shadow-md bg-gray-50 px-20 py-10"
  >
    <h3 class="text-3xl mb-7">Login</h3>
    <label for="username" class="mr-3">Username:</label>
    <input
      name="username"
      class="p-1 rounded shadow-md border border-gray-300"
      bind:value={username}
    />
    <label for="password" class="mr-3">Password:</label>
    <input
      type="password"
      name="password"
      class="p-1 rounded shadow-md border border-gray-300"
      bind:value={password}
    />
    <br />
    <input type="submit" value="Login" class="btn-good-light cursor-pointer" />
  </form>
</div>
