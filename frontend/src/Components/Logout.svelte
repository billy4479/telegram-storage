<script lang="ts">
  import { logout } from '../Logic/authentication';
</script>

<div class="text-right my-3 mr-3">
  <button
    on:click={logout}
    class="border border-gray-300 rounded 
    shadow-md bg-gray-50 py-2 px-3"
  >
    Logout
  </button>
</div>

<style>
</style>
