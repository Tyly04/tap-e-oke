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
var isDX = false;
var isDY = false;
serial.on('found', function(address, name){
  if(name.indexOf('DSD TECH') != -1){
    console.log(address);
    serial.findSerialPortChannel(address, function(channel){
      console.log(channel);
      serial.connect(address, channel, function(){
        console.log('connected');
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
                if(cZ > Math.abs(z) && Math.abs(z) + sensitivity < Math.abs(cZ)){
                  //STOMP
                  exec('.\\variable.exe Space');
                }
                isDX = false;
                isDY = false;
                if(Math.abs(cY) > Math.abs(y) && Math.abs(y) + sensitivity < Math.abs(cY)){
                  //LEFT
                  exec('.\\variable.exe a down');
                  isDX = true;
                } else if (Math.abs(cY) < Math.abs(y) && Math.abs(y) - sensitivity > Math.abs(cY)){
                  //RIGHT
                  exec('.\\variable.exe d down');
                  isDX = true;
                }
                if(Math.abs(cX) > Math.abs(x) && Math.abs(x) + sensitivity < Math.abs(cX)){
                  //UP
                  exec('.\\variable.exe w down');
                  isDY = true;
                } else if (Math.abs(cX) < Math.abs(x) && Math.abs(x) - sensitivity > Math.abs(cX)){
                  //DOWN
                  isDY = true;
                  exec('.\\variable.exe s down');
                }
                if(isDY){
                  exec('.\\variable.exe s up');
                  exec('.\\variable.exe w up');
                }
                if(isDX){
                  exec('.\\variable.exe a up');
                  exec('.\\variable.exe d up')
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
