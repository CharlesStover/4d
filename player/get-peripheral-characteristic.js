const noblePromise = require('./noble-promise');

module.exports = (peripheral, service, characteristic) =>
  new Promise(
    async (resolve, reject) => {
      await noblePromise('connecting to WeVibe Sync', peripheral, peripheral.connect);
      process.on('exit', () => {
        noblePromise('disconnecting from WeVibe Sync', peripheral, peripheral.disconnect);
      });
      const serviceArray = await noblePromise('discovering services', peripheral, peripheral.discoverServices, [ service ]);
      for (const service of serviceArray) {
        console.log('  ' + service.uuid + ': ' + service.name);
        const characteristicArray = await noblePromise(null, service, service.discoverCharacteristics, [ characteristic ]);
        for (const characteristic of characteristicArray) {
          console.log('    ' + characteristic.uuid + ': ' + characteristic.name);
          resolve(characteristic);
          return;
        }
      }
      reject('Characteristic not found.');
    }
  );
