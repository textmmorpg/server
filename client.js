const { start } = require('repl');
var io = require('socket.io-client');
var socket = io.connect('http://localhost:3000', {reconnect: false});
var readline = require('readline');
var read_input;

function login() {

    read_input = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    var login_type;
    read_input.question('Login or Signup? ', (answer) => {
        if(answer === 'login') {
            login_type = 'login';
        } else if(answer === 'signup') {
            login_type = 'signup';
        } else {
            cleanup();
            return;
        }

        read_input.question('User name:', (user) => {
            read_input.question('Password:', (pass) => {
                socket.emit(login_type, {
                    username: user,
                    password: pass
                })
                read_input.close();
            });
        });
    })
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
        if(input.startsWith('say')) {
            socket.emit('say', {msg: input});
        } else if(input.startsWith('walk forward')) {
            socket.emit('walk forward', {});
        } else if(input.startsWith('walk left')) {
            socket.emit('walk left', {});
        } else if(input.startsWith('walk right')) {
            socket.emit('walk right', {});
        } else if(input.startsWith('run forward')) {
            socket.emit('run forward', {});
        } else if(input.startsWith('run left')) {
            socket.emit('run left', {});
        } else if(input.startsWith('run right')) {
            socket.emit('run right', {});
        } else if(input.startsWith('turn left')) {
            socket.emit('turn left', {});
        } else if(input.startsWith('turn right')) {
            socket.emit('turn right', {});
        } else if(input.startsWith('turn around')) {
            socket.emit('turn around', {});
        }
    });
}

function cleanup() {
    socket.removeAllListeners();
    socket.close();
    read_input.close();
}

socket.on('error', (error) => {console.log(error);});

socket.on('connect', function (event) {
    console.log('Connected!');
    login();
});

socket.on('disconnect', function (event) {
    console.log('Disconnected!');
    cleanup();
})

// listen for login success or failure
socket.addEventListener('message', function(event) {
    if(event.login_success) {
        console.log("Login Successful");
        // stop listening for login success
        socket.removeListener('message');
        start_playing();
    } else {
        console.log("Incorrect username/password");
        login();
    }
})
