<svelte:head>
  <script src="https://cdn.jsdelivr.net/npm/d3@4.13.0/build/d3.min.js" charset="utf-8"></script>
  <script src="https://cdn.jsdelivr.net/npm/taucharts@2/dist/taucharts.min.js" type="text/javascript"></script>
</svelte:head>
<script>
  import "../node_modules/bulma/css/bulma.min.css"
  import "../node_modules/taucharts/dist/taucharts.min.css"
  import BluetoothManager from "./BluetoothManager.svelte"

  let dataArray = [];
  function handleNewValue(event) {
    parseValue(event.detail.text).forEach( dataPoint => {
      dataArray.push(dataPoint);
    })

    if (dataArray.length > 1000) {
      drawChart(dataArray);
      dataArray = [];
    }


  }

  function parseValue(str) {
    let valArray = str.split("");

    return [{
      time: parseInt(valArray[0]),
      reading: parseFloat(valArray[1]),
      type: 'red'
    }, {
      time: parseInt(valArray[0]),
      reading: parseFloat(valArray[1]),
      type: 'ir'
    }]
  }
  
  function drawChart(dataArray){
    let chart = new Taucharts.Chart({
      data: dataArray,
      type: 'line',
      x: 'time',
      y: 'reading',
      color: 'type'
    });

    chart.renderTo('#chart');
  }
</script>

<main>
  <h1>Welcome to the HEG Monitor!</h1>
  <BluetoothManager on:value={handleNewValue}/> 
  <div id="chart">
</main>
