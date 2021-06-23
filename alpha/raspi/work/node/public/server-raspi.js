'use strict';

var http = require('http');
var socketio = require('socket.io');
var fs = require('fs');

//

var Gpio = require('onoff').Gpio;
var led = new Gpio(20, 'out');
var button = new Gpio(21, 'in', 'both');
var buzz = new Gpio(16, 'out');
button.watch( (err, value) => {
  if (err) {
    throw err;
  }
  led.writeSync(value? 0 : 1);
  buzz.writeSync(value);
});
process.on('SIGINT', _ => {
  led.unexport();
  button.unexport();
  buzz.unexport();
  // https://github.com/fivdi/onoff/issues/110
  process.exit(0);
});
led.writeSync(0);
buzz.writeSync(1);
console.log('gpio setuped.');

//

var requestListener = (req,res) => {
  console.log(req.method, req.url);
  if(req.url == '/'){
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(fs.readFileSync(__dirname + '/index.html', 'UTF-8'));
  }
};

var server = http.createServer(requestListener);
server.listen(8080);

var sockets = socketio.listen(server).sockets;

var allSockets = {};
var emitAll = function(type, data) {
  for (var id in allSockets) {
    allSockets[id].emit(type, data);
  }
};

sockets.on('connection', function(socket){

  var id = socket.conn.id;
  allSockets[id] = socket;
  console.log('io.sockets connected.', id);

  socket.on('disconnect', function () {
    delete allSockets[id];
    emitAll('test_disconnect', { id: id });
  });

  socket.on('test_msg', function(data) {
    console.log(data);
    data.id = id;
    data.echoBack = true;
    socket.emit('test_msg', data);
    data.broadcast = true;
    emitAll('test_msg', data);
  });
});

console.log('server started.');
