<script lang="ts">
  export let close: () => void;
  export let open: () => void;

  let isOpen = false;

  close = () => {
    isOpen = false;
  };
  open = () => {
    isOpen = true;
  };
</script>

<div class={`modal ${isOpen ? 'modal-open' : ''}`}>
  <div class="modal-box">
    <slot />
  </div>
</div>
