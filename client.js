const { start } = require('repl');
var io = require('socket.io-client');
var readline = require('readline');
var read_login;
var read_input;

function login() {

    read_login = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    // prompt user for login credentials
    read_login.question('User name:', (user) => {
        read_login.question('Password:', (pass) => {
            socket.emit("login", {
                username: user,
                password: pass
            })
            read_login.close();
        });
    });
}

function start_playing() {

    read_input = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    // print output from server
    socket.addEventListener('message', function (event) {
        console.log('Message from server ', event.data);
    });

    // send command line input to server
    read_input.on('line', (input) => {
        socket.emit('message', {msg: input});
    });
}

// connect to server
var socket = io.connect('http://localhost:3000', {reconnect: false});
socket.on('error', (error) => {console.log(error);});

socket.on('connect', function (event) {
    console.log('Connected!');
    login();
});

socket.on('disconnect', function (event) {
    console.log('Disconnected!');
    socket.removeAllListeners();
    socket.close();
    read_login.close();
    read_input.close();
})

// listen for login success or failure
socket.addEventListener('message', function(event) {
    if(event.login_success) {
        console.log("Login Successful");
        socket.removeListener('message');
        start_playing();
    } else {
        login();
    }
})
