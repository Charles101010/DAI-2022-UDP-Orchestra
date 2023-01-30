const protocol = require('./protocol');
const { randomUUID } = require('crypto');
const socket = require('dgram').createSocket('udp4');
const uuid = randomUUID();

const paramInstru = process.argv[2];

if (!paramInstru || !protocol.instruments.hasOwnProperty(paramInstru)) {
    console.log(`Invalid instrument: ${paramInstru}`);
    return;
}

const payload = JSON.stringify({
    uuid,
    sound: protocol.instruments[paramInstru],
});

const message = Buffer.from(payload);

setInterval(() => {
    socket.send(message, 0, message.length, protocol.port, protocol.address, () => {
        console.log(`Sending payload: ${payload} via port ${socket.address().port}`);
    });
}, 1000);