<script>
 // import "../node_modules/bulma/css/bulma.min.css"
  import BluetoothManager from "./BluetoothManager.svelte"
  function handleNewValue(event) {
    console.log('New value: ', event.detail.text)
  }
</script>

<main>
  <h1>Welcome to the HEG Monitor!</h1>
  <BluetoothManager on:value={handleNewValue}/>
</main>
