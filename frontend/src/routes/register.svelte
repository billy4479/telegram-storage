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

<svelte:head>
  <title>Registration - TelegramStorage</title>
</svelte:head>

<div class="flex justify-center items-center md:h-screen h-auto">
  <form
    action="/api/login"
    on:submit|preventDefault={onSubmit}
    autocomplete="off"
    class="form-control md:shadow-lg p-10 md:rounded md:border w-full 
    md:max-w-lg h-full md:h-auto shadow-none border-0"
    bind:this={form}
  >
    <h3 class="text-3xl mb-10">Register</h3>

    <label for="token" class="label">Token:</label>
    <input
      class="input input-bordered"
      type="text"
      name="token"
      bind:value={token}
      placeholder="Token"
    />

    <label for="password" class="label">Password:</label>
    <input
      type="password"
      name="password"
      bind:value={password}
      placeholder="Password"
      class="input input-bordered"
    />

    <label for="password-confirm">Confirm Password:</label>
    <input
      type="password"
      name="password-confirm"
      bind:value={passwordConfirm}
      placeholder="Confirm Password"
      class="input input-bordered"
    />

    <div class="h-3" />

    <PasswordStrength bind:password bind:passwordConfirm />

    <p class="mt-3 overflow-hidden break-words w-100">
      <strong>IMPORTANT:</strong> If you forget your password your files will be
      LOST FOREVER. Use a password manager!
    </p>

    <p class="py-4">
      Already have an account?
      <a class="link link-primary" href="/login">Login here</a>.
    </p>

    <input type="submit" value="Register" class="btn btn-primary" />
  </form>
</div>
