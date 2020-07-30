<script>
  import { createEventDispatcher } from 'svelte';

  export let dataActive = false;

  const dispatch = createEventDispatcher();

  function toggleData(){
    dataActive = !dataActive;
    dispatch('toggle', {
      isActive: dataActive
    })
  }
</script>

{#if dataActive}
  <button on:click={toggleData}>Stop Measurement</button>
{:else}
<button on:click={toggleData}>Start Measurement</button>
{/if}
