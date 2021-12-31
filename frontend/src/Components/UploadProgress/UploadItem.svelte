<script lang="ts">
  import { UploadStatus, uploadStore } from '$lib/api/upload';
  import LoadingSpinner from '../LoadingSpinner.svelte';
  import DoneIcon from 'svelte-icons/md/MdDone.svelte';
  import RemoveIcon from 'svelte-icons/md/MdRemoveCircleOutline.svelte';

  export let key: symbol;
  let hover = false;
</script>

<div
  class={`item ${$uploadStore[key].status === UploadStatus.Done ? 'done' : ''}`}
  on:click={() => {
    if ($uploadStore[key].status === UploadStatus.Done) {
      uploadStore.update((v) => {
        delete v[key];
        return v;
      });
    }
  }}
  on:mouseenter={() => {
    hover = true;
  }}
  on:mouseleave={() => {
    hover = false;
  }}
>
  <div class="w-7 inline-block">
    {#if $uploadStore[key].status !== UploadStatus.Done}
      <LoadingSpinner />
    {:else if hover}
      <RemoveIcon />
    {:else}
      <DoneIcon />
    {/if}
  </div>

  <span>{$uploadStore[key].name}</span>

  <span class="text-right text-dark-50 ml-auto">
    {#if $uploadStore[key].status === UploadStatus.Done}
      Done
    {:else if $uploadStore[key].status === UploadStatus.Encrypting}
      Encrypting
    {:else}
      Uploading
    {/if}
  </span>
</div>

<style>
  .done {
    @apply cursor-pointer;
  }
  .item {
    @apply min-w-80 px-3 py-2 place-items-center gap-4 w-full flex;
  }
</style>
