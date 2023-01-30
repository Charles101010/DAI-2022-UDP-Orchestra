const protocol = require('./protocol');
const musician = require('./musician');
const server = require('dgram').createSocket('udp4');

const TCP_PORT = 2205;

let musicians = new Map();

server.bind(protocol.port, () => {
  console.log("Joining multicast group");
  server.addMembership(protocol.address);
});

const tcpSocket = require('net').createServer();
tcpSocket.listen(TCP_PORT);

tcpSocket.on('connection', (socket) => {
  socket.write(JSON.stringify(Array.from(musicians.keys()), null, 2));
  socket.end();
});

server.on('message', (msg, s) => { // on new datagram
  const data = JSON.parse(msg, null, 2);

  var isFound = false;

  // Update the value
  musicians.forEach((v, key, m) => {
    if (key.uuid == data.uuid) {
      musicians.set(key, Date.now());
      isFound = true;
    }
  });

  if (!isFound) {
    var instrument;
    for ([key, val] of Object.entries(protocol.instruments)) {
      if (val == data.sound) {
        instrument = key;
        break;
      }
    }
    musicians.set(new musician.Musician(data.uuid, instrument, new Date()), Date.now());
  }
});

setInterval(() => {
  musicians.forEach((e, key, m) => {
    if (Date.now() - e > 5000) {
      musicians.delete(key);
    }
  });
}, 100);
