<script lang="ts">
  import { authenticate } from '../lib/api/authentication';

  let userSecret = '';

  async function onSubmit() {
    await authenticate(userSecret);
  }
</script>

<div class="flex justify-center items-center mt-10">
  <form
    action="/api/login"
    on:submit|preventDefault={onSubmit}
    class="border border-gray-300 inline-block rounded shadow-md bg-gray-50 px-20 py-10"
  >
    <h3 class="text-3xl mb-7">Login</h3>
    <label for="userSecret" class="mr-3">User Secret:</label>
    <input
      type="password"
      name="userSecret"
      id="userSecret"
      class="p-1 rounded shadow-md border border-gray-300"
      bind:value={userSecret}
    />
    <br />
    <input
      type="submit"
      value="Login"
      class="border border-gray-300 rounded shadow-md bg-gray-50 py-2 px-3 mt-5"
    />
  </form>
</div>
