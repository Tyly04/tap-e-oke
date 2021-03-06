var SerialPort = require('serialport');
var port = new SerialPort('COM4', {
  baudRate: 9600
});
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require("socket.io")(server);
var fs = require('fs');
app.use(express.static('public'));
server.listen(80);
io.on('connection', function(socket){

});
app.get('/', function (req, res){
  res.sendFile(__dirname + "/index.html");
});
app.get('/hard/editor/:id/', function(req,res){
  res.sendFile(__dirname + "/hardeditor.html");
  io.on('connection', function(socket){
    socket.emit('params', {params: req.params});
  });
});
app.get('/hard/:id/', function(req, res){
  //I know this is global, but I currently don't have a fix.
  res.sendFile(__dirname + "/hard.html");
  io.on('connection', function(socket){
    socket.emit('params', {params: req.params});
  });
});
//Example:
//X:25\n
//Y:25
//OR:
//25 \n
//25
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
port.on('data', function(data){
  //Reads each update as one piece of data.
  var dat = data.toString('utf8');
  var d = parseDat(dat);
  io.emit("input", {input: d});
});
