var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require("socket.io")(server);
var fs = require('fs');
app.use(express.static('public'));
server.listen(80);
app.get('/', function (req, res){
  res.sendFile(__dirname + "/index.html");
});
//Example:
//X:25\n
//Y:25
//OR:
//25 \n
//25
var cString = "";
var arr = [];
function parseDat(data){
  for(var i in data){
    var char = data[i];
    if(char === ","){
      arr[0] = cString;
      cString = "";
    } else if (char === "#") {
      arr[1] = cString;
      cString = "";
      var a = arr;
      arr = [];
      return a;
    } else if(char !== "\n" && char !== "\r") {
      cString += char;
    }
  }
  return null;
}
