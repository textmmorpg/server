var io = require('socket.io-client');

// connect to server
var socket = io.connect('http://localhost:3000', {reconnect: true});

socket.on('connect', function (socket) {
    console.log('Connected!');
});

socket.on('error', (error) => {
    console.log(error);
});

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
});

// send command line input to server
readline.on('line', (input) => {
    if(input === 'exit') {
        readline.close();
        socket.close();
    }
    socket.emit('CH01', {user: 'me', msg: input});
});

// print output from server
socket.addEventListener('message', function (event) {
    console.log('Message from server ', event.data);
});
