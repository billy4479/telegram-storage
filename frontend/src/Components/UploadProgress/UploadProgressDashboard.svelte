<script lang="ts">
  import { uploadStore } from '../../lib/api/upload';
  import UploadItem from './UploadItem.svelte';
</script>

{#if Object.getOwnPropertySymbols($uploadStore).length > 0}
  <div class="absolute bottom-4 right-4 p-4 shadow rounded bg-light-300">
    {#each Object.getOwnPropertySymbols($uploadStore) as key}
      <UploadItem {key} />
    {/each}
  </div>
{/if}
