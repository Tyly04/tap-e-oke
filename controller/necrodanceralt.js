//https://github.com/Tyly04/tap-e-oke/tree/master/controller
//Requires Node.js and possibly Autohotkey
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
                  console.log("Acceleration + Tilt: " + x + "," +  y + "," + z)
                if(cZ > Math.abs(z) && Math.abs(z) + sensitivity < Math.abs(cZ)){
                  //STOMP;

                } else if (cZ < Math.abs(z) && Math.abs(z) - sensitivity > Math.abs(cZ)){

                }
                //Stomp facing up
                if(cX > Math.abs(x) && Math.abs(x) + sensitivity < Math.abs(cX)){
                  console.log("STOMP BACKWARD");
                  exec('.\\variable.exe s n');
                } else if (cX < Math.abs(x) && Math.abs(x) - sensitivity > Math.abs(x)){
                  console.log("STOMP FORWARD");
                  exec('.\\variable.exe w n');
                }
                //Stomp when left side is on bottom.
                if(cY > Math.abs(y) && Math.abs(y) + sensitivity < Math.abs(cY)){
                  console.log("STOMP LEFT");
                  exec('.\\variable.exe a n');
                } else if (cY < Math.abs(y) && Math.abs(y) - sensitivity > Math.abs(cY)){
                  exec('.\\variable.exe d n');
                  console.log("STOMP RIGHT");
                }
                prevState = null;
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
