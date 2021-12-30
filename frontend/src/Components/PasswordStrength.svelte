<script lang="ts">
  import type { ZXCVBNFeedback } from 'zxcvbn';
  import { zxcvbnAsync } from '$lib/zxcvbnAsync';

  export let password: string;
  export let passwordConfirm: string;
  let first = '';
  let second = '';
  let third = '';
  let forth = '';
  let fifth = '';

  let suggestion: ZXCVBNFeedback | undefined;

  $: {
    (async () => {
      if (password && password !== '') {
        const r = await zxcvbnAsync(password);

        suggestion = r.feedback;
        switch (r.score) {
          case 0:
            first = 'week';
            second = '';
            third = '';
            forth = '';
            fifth = '';
            break;
          case 1:
            first = 'bad';
            second = 'bad';
            third = '';
            forth = '';
            fifth = '';
            break;
          case 2:
            first = 'decent';
            second = 'decent';
            third = 'decent';
            forth = '';
            fifth = '';
            break;

          case 3:
            first = 'good';
            second = 'good';
            third = 'good';
            forth = 'good';
            fifth = '';
            break;

          case 4:
            first = 'strong';
            second = 'strong';
            third = 'strong';
            forth = 'strong';
            fifth = 'strong';
            break;
        }
      } else {
        first = '';
        second = '';
        third = '';
        forth = '';
        fifth = '';
        suggestion = undefined;
      }
    })();
  }
</script>

<div class="border shadow rounded p-3 bg-light-50 overflow-hidden break-words">
  <h3 class="mb-3">Password strength:</h3>
  <div class="h-2 w-full flex gap-2">
    <div class="{first} bar" />
    <div class="{second} bar" />
    <div class="{third} bar" />
    <div class="{forth} bar" />
    <div class="{fifth} bar" />
  </div>

  {#if suggestion && (suggestion.suggestions.length !== 0 || suggestion.warning !== '')}
    <div class="mt-3">
      Suggestions:
      <ul class="list-disc block overflow-hidden break-words w-100">
        {#each suggestion.suggestions as s}
          <li class="ml-10">{s}</li>
        {/each}
      </ul>
      {#if suggestion.warning !== ''}
        <p class="font-bold">WARNING: {suggestion.warning}</p>
      {/if}
    </div>
  {/if}

  {#if password !== passwordConfirm}
    <p class="text-red-600 font-bold">Password does not match.</p>
  {/if}
</div>

<style>
  .bar {
    @apply inline-block flex-grow h-full rounded shadow bg-gray-400;
  }
  .week {
    @apply bg-red-600;
  }
  .bad {
    @apply bg-orange-500;
  }
  .decent {
    @apply bg-yellow-500;
  }
  .good {
    @apply bg-blue-500;
  }
  .strong {
    @apply bg-green-600;
  }
</style>
