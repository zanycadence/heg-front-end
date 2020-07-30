<script>
  import { createEventDispatcher } from 'svelte';
  import DataToggle from './DataToggle.svelte';
  let connected = false;
  let bluetoothAvailable = navigator.bluetooth;
  
  //event dispatcher
  const dispatch = createEventDispatcher();

  let connectionError = false;
  let connectionButtonText = 'Connect to HEG Sensor...';
  let connectionButtonVis = "";

  //UI element control
  let connectingActive= false;
  let serviceDiscoveryActive = false;
  let charDiscoveryActive = false;
  let controlsActive = false;

  //UUIDs for service/chars
  let rxUuid = "6e400002-b5a3-f393-e0a9-e50e24dcca9e";
  let txUuid = "6e400003-b5a3-f393-e0a9-e50e24dcca9e";
  let serviceUuid = "6e400001-b5a3-f393-e0a9-e50e24dcca9e";

  //cache the tx/rx characteristics to write values to
  let txChar, rxChar = {};

  function handleCharacteristicChange() {
    charDiscoveryActive = false;
    controlsActive = true;

    dispatch('value', {
      text: ab2str(txChar.value.buffer)
    })

  }

  function sendCommand(str) {
    rxChar.writeValue(str2ab(str));
  }

  function handleToggle(event){
      if (event.detail.isActive){
        sendCommand("t"); //turns sensor on
      } else {
        sendCommand("f"); //turns sensor off
      }
  }
  
  function ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint8Array(buf));
  }

  function str2ab(str) {
    var buf = new ArrayBuffer(2*str.length);
    var bufView = new Uint16Array(buf);
    for (var i=0; i< str.length; i++){
      bufView[i] = str.charCodeAt(i);
    }
    return buf;
  }

  function handleDeviceDiscovery() {
    let options = {
      filters: [
       {name: 'HEG'},
       {services: [ serviceUuid ]}
      ]
    };
    navigator.bluetooth.requestDevice(options)
      .then(device => {
        connectionButtonVis = "hidden";
        connectingActive = true;
        connectionError = false;
        return device.gatt.connect();
      })
      .then(server => {
        connectingActive = false;
        serviceDiscoveryActive = true;
        return server.getPrimaryServices();
      })
      .then(services => {
        serviceDiscoveryActive = false;
        charDiscoveryActive = true;

        services.forEach(service => {
          service.getCharacteristics()
            .then(characteristics => {
              characteristics.forEach(characteristic => {
                if (characteristic.uuid == txUuid)
                {
                  //Register listener for incoming data
                  txChar = characteristic;
                  txChar.startNotifications()
                    .then(_ => {
                      txChar.addEventListener('characteristicvaluechanged', handleCharacteristicChange);
                    })
                }
                if (characteristic.uuid == rxUuid)
                {
                  //Write 't' to characteristic to start measurements
                  rxChar = characteristic;
                  sendCommand("t");
                }
              })
            })
        })
      })
      .catch(error => {
        connectionError = true;
        connectionButtonVis = "";
        connectionButtonText = 'Reconnect to HEG Sensor...';
      })
  }
</script>

{#if bluetoothAvailable}
  {#if connectionError}
  <p>An error occured connecting to the BLE Sensor, please retry connecting...</p>
  {/if}
  <button on:click={handleDeviceDiscovery} hidden={connectionButtonVis}>{connectionButtonText}</button>
{:else}
<p>Your browser does not support the Web Bluetooth API, please use Chrome, Opera, or Edge browser...</p>
{/if}

{#if connectingActive}
<p>Connecting to sensor...</p>
{/if}

{#if serviceDiscoveryActive}
<p>Discovering services..</p>
{/if}

{#if charDiscoveryActive}
<p>Registering characteristics...</p>
{/if}

{#if controlsActive}
<DataToggle on:toggle={handleToggle} dataActive={true} />
{/if}
