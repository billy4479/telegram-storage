<script lang="ts">
  import { errorStore } from '../../lib/displayError';
  export let close: () => void;
</script>

<h1 class="text-3xl mb-3">An error has occurred...</h1>
<pre class="overflow-auto">
    {$errorStore}
</pre>

<button on:click={close} class="btn-neutral mt-5">Ok</button>
