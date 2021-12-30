<script lang="ts">
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import PasswordStrength from '$comp/PasswordStrength.svelte';

  import { register } from '$lib/api/register';
  import { prefetchSodium } from '$lib/crypto/manager';
  import { displayError } from '$lib/displayError';

  let token = '';
  let password = '';
  let passwordConfirm = '';

  let form: HTMLFormElement;

  function onSubmit() {
    if (password !== passwordConfirm) {
      form.reset();
      displayError('The password does not match');
      return;
    }
    register(token, password).then(() => goto('/a'));
  }

  onMount(prefetchSodium);
</script>

<div class="flex justify-center items-center h-screen">
  <form
    action="/api/login"
    on:submit|preventDefault={onSubmit}
    autocomplete="off"
    class="border border-gray-300 inline-block rounded shadow-md bg-gray-50 px-20 py-10"
    bind:this={form}
  >
    <h3 class="text-3xl mb-10">Register</h3>
    <div class="flex flex-col">
      <div class="mt-3">
        <label for="token">Token:</label>
        <input
          type="text"
          name="token"
          bind:value={token}
          placeholder="Token"
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
      <div class="my-3">
        <label for="password-confirm">Confirm Password:</label>
        <input
          type="password"
          name="password-confirm"
          bind:value={passwordConfirm}
          placeholder="Confirm Password"
        />
      </div>

      <PasswordStrength bind:password bind:passwordConfirm />

      <p class="mt-3 overflow-hidden break-words w-100">
        <strong>IMPORTANT:</strong> If you forget your password your files will be
        LOST FOREVER. Use a password manager!
      </p>

      <p class="py-4">
        Already have an account?
        <a class="text-blue-600 underline" href="/login">Login here</a>.
      </p>

      <input
        type="submit"
        value="Register"
        class="btn-good-light cursor-pointer"
      />
    </div>
  </form>
</div>

<style>
  label {
    @apply mr-3 w-45 inline-block;
  }
</style>
