const { start } = require('repl');
var io = require('socket.io-client');
var readline = require('readline');

// connect to server
var socket = io.connect('http://localhost:3000', {reconnect: true});

var read_input = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});


var username;
socket.on('connect', function (socket) {
    console.log('Connected!');
    read_input.question('User name:', (input) => {
        username = input;
    });
});

socket.on('error', (error) => {
    console.log(error);
});

// print output from server
socket.addEventListener('message', function (event) {
    console.log('Message from server ', event.data);
});

// send command line input to server
read_input.on('line', (input) => {
    if(input === 'exit') {
        readline.close();
        socket.close();
    }
    if(username) {
        socket.emit('sound', {user: username, msg: input});
    }
});
