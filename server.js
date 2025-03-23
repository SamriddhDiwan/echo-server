const WebSocket = require('ws');

const server = new WebSocket.Server({ port: process.env.PORT || 8080 });

server.on('connection', (socket) => {
    console.log('Client connected');

    socket.on('message', (message) => {
        console.log(`Received: ${message}`);
        socket.send(`Echo: ${message}`); // Echo the message back
    });

    socket.on('close', () => {
        console.log('Client disconnected');
    });
});

console.log(`WebSocket echo server is running on ws://localhost:${process.env.PORT || 8080}`);