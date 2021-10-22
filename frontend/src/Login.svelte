<script lang="ts">
  let userSecret = '';

  interface Res {
    token: string;
  }

  function onSubmit() {
    fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({ userSecret }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((raw) => {
        localStorage.setItem('jwt', (raw as Res).token);
      });
  }
</script>

<form action="/api/login" on:submit|preventDefault={onSubmit}>
  <label for="userSecret">User Secret</label>
  <input
    type="text"
    name="userSecret"
    id="userSecret"
    bind:value={userSecret}
  />
</form>
