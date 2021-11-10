<script lang="ts">
  import { register } from '../lib/api/register';

  let token = '';
  let password = '';

  async function onSubmit() {
    await register(token, password);
  }
</script>

<div class="flex justify-center items-center mt-10">
  <form
    action="/api/login"
    on:submit|preventDefault={onSubmit}
    class="border border-gray-300 inline-block rounded shadow-md bg-gray-50 px-20 py-10"
  >
    <h3 class="text-3xl mb-7">Register</h3>
    <label for="token" class="mr-3">Token:</label>
    <input
      name="token"
      id="token"
      class="p-1 rounded shadow-md border border-gray-300"
      bind:value={token}
    />
    <label for="password" class="mr-3">Password:</label>
    <input
      type="password"
      name="password"
      id="password"
      class="p-1 rounded shadow-md border border-gray-300"
      bind:value={password}
    />
    <br />
    <input
      type="submit"
      value="Register"
      class="btn-good-light cursor-pointer"
    />
  </form>
</div>
