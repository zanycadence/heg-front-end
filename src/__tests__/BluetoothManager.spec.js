import '@testing-library/jest-dom/extend-expect'

import { render, fireEvent } from '@testing-library/svelte'

import BluetoothManager from '../BluetoothManager.svelte'

test('Shows Connection Button if browser supports web bluetooth api', ()=>{
    navigator.bluetooth = true
    const { getByText } = render(BluetoothManager)
    
    expect(getByText('Connect to HEG Sensor...')).toBeInTheDocument()
})

test('Shows help text if the browser does not support web bluetooth api', () => {
    navigator.bluetooth = undefined

    const { getByText } = render(BluetoothManager)

    expect(getByText('Your browser does not support the Web Bluetooth API, please use Chrome, Opera, or Edge browser...')).toBeInTheDocument()
})

//Fails right now, investigate how to work with mocks/Promises in jest
test('show help message, if user cancels the connection dialog, or if dialog times out', async () => {
    navigator.bluetooth = {}
    navigator.bluetooth.requestDevice = () => {
       return new Promise((_, reject) =>
        {    
            reject("DOMException: User cancelled the requestDevice() dialog")
        })
    }

    const { getByText } = render(BluetoothManager)

    const connectButton = getByText('Connect to HEG Sensor...')

    await fireEvent.click(connectButton)

    //const { getByUpdatedText } 
    expect(connectButton)
        .toHaveTextContent('Reconnect to HEG Sensor...')
})
