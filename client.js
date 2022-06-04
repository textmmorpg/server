var io = require('socket.io-client');

var socket = io.connect('http://localhost:3000', {
    reconnect: true
});

// Add a connect listener
socket.on('connect', function (socket) {
    console.log('Connected!');
});

socket.on('error', (error) => {
    console.log(error);
});

socket.emit('CH01', {user: 'me', msg: 'whazzzup?'});
