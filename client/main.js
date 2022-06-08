$(function() {


    // Initialize variables
    const $window = $(window);
    const $username = $('#username'); // Input for username
    const $password = $('#password'); // Input for username
    const $isLogin = $('#isLogin')
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
    let login_success = false;

    // Sets the client's username
    const setUsername = () => {
        is_login = $isLogin.val();
        var login_type = is_login? "login": "signup";
        username = cleanInput($username.val().trim());
        password = cleanInput($password.val().trim());

        // If the username is valid
        if (username && password && is_login) {
            // Tell the server your username
            socket.emit(login_type, {
                username: username,
                password: password
            })
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

        }
        // When the client hits ENTER on their keyboard
        if (event.which === 13) {
            if (login_success) {
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

    function start_playing() {

        // read_input = readline.createInterface({
        //     input: process.stdin,
        //     output: process.stdout,
        // });

        // print output from server

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
        console.log('Connected!');
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

            $loginPage.fadeOut();
            $chatPage.show();
            $loginPage.off('click');
            login_success = true;
        } else {
            // TODO: also check for username already taken on signup
            console.log("Incorrect username/password");
            $('#username').val('');
            $('#password').val('');
            $('#incorrectPassword').attr('hidden', false);
        }
    })

});
