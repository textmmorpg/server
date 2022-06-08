$(function() {


    // Initialize variables
    const $window = $(window);
    const $usernameInput = $('#username'); // Input for username
    const $passwordInput = $('#password'); // Input for username
    const $messages = $('.messages');           // Messages area
    const $inputMessage = $('.inputMessage');   // Input message input box

    const $loginPage = $('.login.page');        // The login page
    const $chatPage = $('.chat.page');          // The chatroom page
    
    const socket = io.connect('http://localhost:3000', {reconnect: false});

    // Prompt for setting a username
    let username;
    let connected = false;
    let typing = false;
    let lastTypingTime;
    let $currentInput;

    // Sets the client's username
    const setUsername = () => {
        username = cleanInput($username.val().trim());
        password = cleanInput($password.val().trim());

        // If the username is valid
        if (username) {
            $loginPage.fadeOut();
            $chatPage.show();
            $loginPage.off('click');
            $currentInput = $inputMessage.focus();

            // Tell the server your username
            socket.emit('add user', username);
        }
    }

    // Log a message
    const log = (message, options) => {
        const $el = $('<li>').addClass('log').text(message);
        addMessageElement($el, options);
    }

    // Adds the visual chat message to the message list
    const addChatMessage = (data, options = {}) => {
        // Don't fade the message in if there is an 'X was typing'
        const $typingMessages = getTypingMessages(data);
        if ($typingMessages.length !== 0) {
            options.fade = false;
            $typingMessages.remove();
        }

        const $usernameDiv = $('<span class="username"/>')
            .text(data.username)
            .css('color', getUsernameColor(data.username));
        const $messageBodyDiv = $('<span class="messageBody">')
            .text(data.message);

        const typingClass = data.typing ? 'typing' : '';
        const $messageDiv = $('<li class="message"/>')
            .data('username', data.username)
            .addClass(typingClass)
            .append($usernameDiv, $messageBodyDiv);

        addMessageElement($messageDiv, options);
    }


    // Adds a message element to the messages and scrolls to the bottom
    // el - The element to add as a message
    // options.fade - If the element should fade-in (default = true)
    // options.prepend - If the element should prepend
    //     all other messages (default = false)
    const addMessageElement = (el, options) => {
        const $el = $(el);
        // Setup default options
        if (!options) {
            options = {};
        }
        if (typeof options.fade === 'undefined') {
            options.fade = true;
        }
        if (typeof options.prepend === 'undefined') {
            options.prepend = false;
        }

        // Apply options
        if (options.fade) {
            $el.hide().fadeIn(FADE_TIME);
        }
        if (options.prepend) {
            $messages.prepend($el);
        } else {
            $messages.append($el);
        }

        $messages[0].scrollTop = $messages[0].scrollHeight;
    }

    // Prevents input from having injected markup
    const cleanInput = (input) => {
        return $('<div/>').text(input).html();
    }

    // Keyboard events

    $window.keydown(event => {
        // Auto-focus the current input when a key is typed
        if (!(event.ctrlKey || event.metaKey || event.altKey)) {
            $currentInput.focus();
        }
        // When the client hits ENTER on their keyboard
        if (event.which === 13) {
            if (username) {
                sendMessage();
                typing = false;
            } else {
                setUsername();
            }
        }
    });

    $inputMessage.on('input', () => {
        updateTyping();
    });

    // Click events

    // Focus input when clicking anywhere on login page
    $loginPage.click(() => {
        $currentInput.focus();
    });

    // Focus input when clicking on the message input's border
    $inputMessage.click(() => {
        $inputMessage.focus();
    });

    // Socket handlers

    function login() {

        // read_input = readline.createInterface({
        //     input: process.stdin,
        //     output: process.stdout,
        // });

        // var login_type;
        // read_input.question('Login or Signup? ', (answer) => {
        //     if(answer === 'login') {
        //         login_type = 'login';
        //     } else if(answer === 'signup') {
        //         login_type = 'signup';
        //     } else {
        //         cleanup();
        //         return;
        //     }

        //     read_input.question('User name:', (user) => {
        //         read_input.question('Password:', (pass) => {
        //             socket.emit(login_type, {
        //                 username: user,
        //                 password: pass
        //             })
        //             read_input.close();
        //         });
        //     });
        // })
    }

    function start_playing() {

        // read_input = readline.createInterface({
        //     input: process.stdin,
        //     output: process.stdout,
        // });

        // print output from server
        socket.addEventListener('message', function (event) {
            console.log(event.data);
        });

        // send command line input to server
        // read_input.on('line', (input) => {
        //     if(input.startsWith('say')) {
        //         socket.emit('say', {msg: input});
        //     } else if(input.startsWith('walk forward')) {
        //         socket.emit('walk forward', {});
        //     } else if(input.startsWith('walk left')) {
        //         socket.emit('walk left', {});
        //     } else if(input.startsWith('walk right')) {
        //         socket.emit('walk right', {});
        //     } else if(input.startsWith('run forward')) {
        //         socket.emit('run forward', {});
        //     } else if(input.startsWith('run left')) {
        //         socket.emit('run left', {});
        //     } else if(input.startsWith('run right')) {
        //         socket.emit('run right', {});
        //     } else if(input.startsWith('turn left')) {
        //         socket.emit('turn left', {});
        //     } else if(input.startsWith('turn right')) {
        //         socket.emit('turn right', {});
        //     } else if(input.startsWith('turn around')) {
        //         socket.emit('turn around', {});
        //     } else if(input.startsWith('look')) {
        //         socket.emit('look', {});
        //     }
        // });
    }

    function cleanup() {
        socket.removeAllListeners();
        socket.close();
    }

    socket.on('error', (error) => {console.log(error);});

    socket.on('connect', function (event) {
        connected = true;
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

});
