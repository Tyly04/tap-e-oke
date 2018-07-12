var noble = require('noble');
var RSSI_THRESHOLD    = -90;
var EXIT_GRACE_PERIOD = 2000; // milliseconds

var inRange = [];

noble.on('discover', peripheral => {
    // connect to the first peripheral that is scanned
    if (peripheral.rssi < RSSI_THRESHOLD) {
    // ignore
      return;
    }

    var id = peripheral.id;
    var entered = !inRange[id];

    if (entered) {
      inRange[id] = {
        peripheral: peripheral
      };

      console.log('"' + peripheral + '" entered (RSSI ' + peripheral.rssi + ') ' + new Date());
    }

    inRange[id].lastSeen = Date.now();

});
noble.on('stateChange', state => {
  if (state === 'poweredOn') {
    console.log('Scanning');
    noble.startScanning();
  } else {
    noble.stopScanning();
  }
});
function connectAndSetUp(peripheral) {

  peripheral.connect(error => {
    console.log('Connected to', peripheral.id);
  });

  peripheral.on('disconnect', () => console.log('disconnected'));
}
