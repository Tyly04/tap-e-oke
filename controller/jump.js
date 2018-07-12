var cString = "";
var arr = [];
var c = 0;
function parseDat(data){
  for(var i in data){
    var char = data[i];
    if(char === ","){
      arr[c] = cString;
      cString = "";
      c += 1;
    } else if (char === "#") {
      arr[2] = cString;
      cString = "";
      var a = arr;
      arr = [];
      c = 0;
      return a;
    } else if(char !== "\n" && char !== "\r") {
      cString += char;
    }
  }
  return null;
}
var BTSP = require('bluetooth-serial-port');
var serial = new BTSP.BluetoothSerialPort();
serial.on('found', function(address, name){
  if(name.indexOf('DSD TECH') != -1){
    console.log(address);
    serial.findSerialPortChannel(address, function(channel){
      console.log(channel);
      serial.connect(address, channel, function(){
        console.log('connected');
        serial.on('data', function(buffer){
          var dat = buffer.toString('utf8');
          console.log(parseDat(dat));

        });
      }, function(){
        console.log('cannot connect');
      });
    }, function(){
      console.log('found nothing');
    });
  }
});
serial.inquire();
