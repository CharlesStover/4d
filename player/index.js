const WE_VIBE_CHARACTERISTIC = 'f000c00004514000b000000000000000';
const WE_VIBE_SERVICE = 'f000bb0304514000b000000000000000';

const noble = require('noble-uwp');
const getPeripheralCharacteristic = require('./get-peripheral-characteristic');
const parseStory = require('./parse-story');
const weVibeCommand = require('./command');
const weVibeHandshake = require('./handshake');

const story = parseStory('./demo.csvs');

process.on('SIGINT', () => {
  process.exit();
});

noble.on('discover', async (peripheral) => {
  const peripheralName =
    peripheral.advertisement.localName ?
      peripheral.advertisement.localName :
      peripheral.id;
  console.log(
    'Peripheral found:' + peripheralName +
    (
      peripheral.advertisement.serviceUuids.length > 0 ?
        ' (Services: ' + peripheral.advertisement.serviceUuids.join(', ') + ')' :
        ''
    )
  );
  if (peripheral.id === 'c8fd1945c90a') {
    console.log('WeVibe Sync found!');
    noble.stopScanning();
    try {
      const ch = await getPeripheralCharacteristic(peripheral, WE_VIBE_SERVICE, WE_VIBE_CHARACTERISTIC);
      await weVibeHandshake(ch);
      // let lastTimestamp = 0;
      // let lastCommand = { mode: 'off', inner: 0, outer: 0 };
      for (const [ timestamp, mode, inner, outer ] of story) {
        /*
        const repeatCommand = Object.assign({}, lastCommand);
        for (let x = lastTimestamp + 1000; x < timestamp; x += 1000) {
          setTimeout(
            () => {
              weVibeCommand(ch, repeatCommand);
            },
            x
          )
        }
        */
        setTimeout(
          () => {
            weVibeCommand(ch, { mode, inner, outer });
          },
          timestamp
        );
        // lastCommand = { mode, inner, outer };
        // lastTimestamp = timestamp;
      }
      /*
      await new Promise(
        (resolve, reject) => {
          setTimeout(
            () => {
              await noblePromise('disconnecting from WeVibe Sync', peripheral, peripheral.disconnect);
              resolve();
            },
            lastTimestamp + 1000
          );
        }
      );
      */
    }
    catch (error) {
      console.error('Error:', error);
    }
  }
});

noble.on('stateChange', (state) => {
  console.log('Noble state:', state);
  if (state === 'poweredOn') {
    noble.startScanning();
  }
  else {
    noble.stopScanning();
  }
});

noble.on('warning', (message) => {
  console.warn('Noble warning:', message);
});
