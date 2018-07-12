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
var prevState = null;
var cX = null;
var cY = null;
var cZ = null;
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
          console.log(data);
            UpdateStomp.inputState = 0;
            if(data){
              //Configuration:
              var x = parseInt(data.input[0]);
              var y = parseInt(data.input[1]);
              var z = parseInt(data.input[2]);
              //Should be how this is configured:
              //(Accounting for accelerometer rotation)
              x = z * 1;
              y = y * 1;
              z = x * 1;
              if(cX){
                if(cZ > Math.abs(z) && Math.abs(z) + 3 < Math.abs(cZ)){
                  //STOMP
                  if(prevState !== null){
                    execute(__dirname + prevState + ".exe");
                  }
                }
                prevState = null;
                if(Math.abs(cY) > Math.abs(y) && Math.abs(y) + 3 < Math.abs(cY)){
                  //LEFT
                  prevState = "a";
                } else if (Math.abs(cY) < Math.abs(y) && Math.abs(y) - 3 > Math.abs(cY)){
                  //RIGHT
                  prevState = "d";
                }
                if(Math.abs(cX) > Math.abs(x) && Math.abs(x) + 3 < Math.abs(cX)){
                  //UP
                  prevState = "w";
                } else if (Math.abs(cX) < Math.abs(x) && Math.abs(x) - 3 > Math.abs(cX)){
                  //DOWN
                  prevState = "s";
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
