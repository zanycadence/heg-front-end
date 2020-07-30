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

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>
