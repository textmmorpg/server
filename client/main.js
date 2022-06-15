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
    
    const socket = io.connect('wss://textmmo.com:3000', {
        reconnect: false, secure:true, transports: ['websocket']
    });

    // Prompt for setting a username
    let username;
    let connected = false;
    let $currentInput;
    let login_success = false;

    // Sets the client's username
    const setUsername = () => {
        username = cleanInput($username.val().trim());
        password = cleanInput($password.val().trim());

        // If the username is valid
        if (username && password) {
            // Tell the server your username
            socket.emit('login', {
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


    const COLORS = [
        '#e21400', '#91580f', '#f8a700', '#f78b00',
        '#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
        '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
      ];
    
    const COLORS_MAP = {
        'You': COLORS[0],
        'Server': COLORS[1],
    }

    // Gets the color of a username through our hash function
    const getUsernameColor = (username) => {
        return COLORS_MAP[username]
        // // Compute hash code
        // let hash = 7;
        // for (let i = 0; i < username.length; i++) {
        // hash = username.charCodeAt(i) + (hash << 5) - hash;
        // }
        // // Calculate color
        // const index = Math.abs(hash % COLORS.length);
        // return COLORS[index];
    }


    // Adds the visual chat message to the message list
    const addChatMessage = (data, options = {}) => {
        // Don't fade the message in if there is an 'X was typing'
        const $usernameDiv = $('<span class="username"/>')
            .text(data.username)
            .css('color', getUsernameColor(data.username));
        const $messageBodyDiv = $('<span class="messageBody">')
            .text(data.input);

        const $messageDiv = $('<li class="message"/>')
            .data('username', data.username)
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
        if(login_success) {
            $inputMessage.focus();
        }
    });

    // Focus input when clicking on the message input's border
    $inputMessage.click(() => {
        $inputMessage.focus();
    });

    // Socket handlers

    const sendMessage = () => {

        var input = cleanInput($inputMessage.val());

        if (input && connected && login_success) {
            $inputMessage.val('');
            addChatMessage({username: 'You', input: input});
            if(input.startsWith('say')) {
                socket.emit('say', {msg: input});
            } else if(input.startsWith('walk forward')) {
                socket.emit('walk forward', {});
            } else if(input.startsWith('walk left')) {
                socket.emit('walk left', {});
            } else if(input.startsWith('walk right')) {
                socket.emit('walk right', {});
            } else if(input.startsWith('swim forward')) {
                socket.emit('swim forward', {});
            } else if(input.startsWith('swim left')) {
                socket.emit('swim left', {});
            } else if(input.startsWith('swim right')) {
                socket.emit('swim right', {});
            } else if(input.startsWith('run forward')) {
                socket.emit('run forward', {});
            } else if(input.startsWith('run left')) {
                socket.emit('run left', {});
            } else if(input.startsWith('run right')) {
                socket.emit('run right', {});
            } else if(input.startsWith('turn left')) {
                socket.emit('turn left', {});
            } else if(input.startsWith('turn slight left')) {
                socket.emit('turn slight left', {});
            } else if(input.startsWith('turn hard left')) {
                socket.emit('turn hard left', {});
            } else if(input.startsWith('turn slight right')) {
                socket.emit('turn slight right', {});
            } else if(input.startsWith('turn hard right')) {
                socket.emit('turn hard right', {});
            } else if(input.startsWith('turn right')) {
                socket.emit('turn right', {});
            } else if(input.startsWith('turn around')) {
                socket.emit('turn around', {});
            } else if(input.startsWith('look')) {
                socket.emit('look', {});
            } else if(input.startsWith('sit down')) {
                socket.emit('sit down', {});
            } else if(input.startsWith('lay down')) {
                socket.emit('lay down', {});
            } else if(input.startsWith('stand up')) {
                socket.emit('stand up', {});
            } else if(input.startsWith('vibe check')) {
                socket.emit('vibe check')
            } else if(input.startsWith('whisper')) {
                socket.emit('whisper', {msg: input})
            } else if(input.startsWith('yell')) {
                socket.emit('yell', {msg: input})
            } else if(input.startsWith('exit')) {
                socket.emit('exit', {})
            } else {
                log('Command not defined');
            }
        }
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
            socket.removeListener('message');
            socket.addEventListener('message', (event) => {

                if(event.active_users !== null) {
                    try {
                        log("Active users: " + event.active_users.toString());
                        return;
                    } catch {}
                }

                addChatMessage({
                    input:event.data,
                    username: 'Server'
                })
            })
        } else {
            // TODO: also check for username already taken on signup
            console.log("Incorrect username/password");
            $('#username').val('');
            $('#password').val('');
            $('#incorrectPassword').attr('hidden', false);
            setTimeout(() => {
                $('#incorrectPassword').attr('hidden', true);
            }, 3000)
        }
    })

});
