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
var {exec} = require('child_process');
var prevState = null;
var cX = null;
var cY = null;
var cZ = null;
var constants = {
  x: 1,
  y: 2,
  z: -1
};
//Figured out bug: X axis counts as z, but you push down from any rotation. Count stomp only when rotated a certain way.
serial.on('found', function(address, name){
  if(name.indexOf('DSD TECH') != -1){
    serial.findSerialPortChannel(address, function(channel){
      console.log(channel);
      serial.connect(address, channel, function(){
        console.log('connected.');
        serial.on('data', function(buffer){
          var dat = buffer.toString('utf8');
          var data = parseDat(dat);
            if(data){
              //Configuration:
              var x = parseInt(data[0]);
              var y = parseInt(data[1]);
              var z = parseInt(data[2]);
              //Should be how this is configured:
              //(Accounting for accelerometer rotation)
              x = z;
              y = y;
              z = x;
              var sensitivity = 3;
              if(cX){
                if(prevState !== null){
                  //STOMP FACING forward
                if(cZ > Math.abs(z) && Math.abs(z) + sensitivity < Math.abs(cZ)){
                  //STOMP;
                    exec('start ' + prevState);
                } else if (cZ < Math.abs(z) && Math.abs(z) - sensitivity > Math.abs(cZ)){
                    exec('start ' + prevState);
                }
                //Stomp facing up
                if(cX > Math.abs(x) && Math.abs(x) + sensitivity < Math.abs(cX)){
                  exec('start ' + prevState);
                } else if (cX < Math.abs(x) && Math.abs(x) - sensitivity > Math.abs(x)){
                  exec('start ' + prevState);
                }
                //Stomp when left side is on bottom.
                if(cY > Math.abs(y) && Math.abs(y) + sensitivity < Math.abs(cY)){
                  exec('start ' + prevState);
                } else if (cY < Math.abs(y) && Math.abs(y) - sensitivity > Math.abs(cY)){
                  exec('start ' + prevState);
                }
                prevState = null;
              }
                if(x > constants.x + sensitivity){
                  //TILT FORWARD;
                  prevState = 'w';
                } else if (x < constants.x - sensitivity){
                  prevState = 's';
                }
                if(y > constants.y + sensitivity){
                  prevState = 'a';
                } else if (y < constants.y - sensitivity){
                  prevState = 'd';
                }
                cX = x;
                cY = y;
                cZ = z;
              } else {
                cX = x;
                cY = y;
                cZ = z;
              }
            }
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
