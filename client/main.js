$(function() {

    // Initialize variables
    const $window = $(window);
    const $username = $('#username'); // Input for username
    const $password = $('#password'); // Input for username
    const $messages = $('.messages');           // Messages area
    const $inputMessage = $('.inputMessage');   // Input message input box

    const $loginPage = $('.login.page');        // The login page
    const $chatPage = $('.chat.page');          // The chatroom page
    // const $ad = $('#amzn-assoc-ad-8d6b661a-ffac-4406-8bff-1ab6935f8734');

    window.onload = function () {
        google.accounts.id.initialize({
          client_id: '797291709791-3u14qu9midq1pp234q5f3roo9h322bqe',
          callback: setUsername
        });
        google.accounts.id.prompt();
    };

    var socket;
    var username;
    var password;
    var connected = false;
    var login_success = false;

    function connect() {
        if(window.location.hostname === 'textmmo.com') {
            socket = io.connect('https://textmmo.com/', {
                secure:true, transports: ['websocket']
            });
        } else {
            socket = io.connect('http://localhost:3000/', {});
        }
    }

    connect();

    // Sets the client's username
    const setUsername = (data) => {
        console.log(data);
        username = cleanInput($username.val().trim());
        password = cleanInput($password.val().trim());

        // If the username is valid
        if (username && password) {
            // Tell the server your username
            socket.emit('login', {
                username: username,
                password: password,
                reconnection: false
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
            }
        }
    });

    // Click events

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
            input = input.toLowerCase();
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
            } else if(input.startsWith('turn to face north')) {
                socket.emit('turn to face north', {})
            } else if(input.startsWith('turn to face south')) {
                socket.emit('turn to face south', {})
            } else if(input.startsWith('turn to face east')) {
                socket.emit('turn to faceeast', {})
            } else if(input.startsWith('turn to face west')) {
                socket.emit('turn to face west', {})
            } else if(input.startsWith('turn a little to the right')) {
                socket.emit('turn a little to the right', {})
            } else if(input.startsWith('turn a little to the left')) {
                socket.emit('turn a little to the left', {})
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
            } else if(input.startsWith('commit suicide')) {
                socket.emit('suicide')
            } else if(input.startsWith('whisper')) {
                socket.emit('whisper', {msg: input})
            } else if(input.startsWith('yell')) {
                socket.emit('yell', {msg: input})
            } else if(input.startsWith('teleport to')) {
                socket.emit('teleport to', {msg: input})
            } else if(input.startsWith('check patch notes')) {
                socket.emit('check patch notes', {})
            } else if(input.startsWith('punch')) {
                socket.emit('punch', {});
            } else if(input.startsWith('?') || input.startsWith('help')) {
                help_message();
            } else {
                log('Command not defined');
            }
        }
    }

    function help_message() {
        addChatMessage({
            username: 'Server',
            input: "This is a multiplayer text adventure game! " +
            "Type commands to interact with the world and other players. " +
            "For example, type 'walk forward' to walk, 'turn right' to turn, etc. " +
            "Use 'say hello' to say hello to players around you. Use 'look' or 'vibe check' to " + 
            "examine your immediate environment. For the full list of commands, " +
            "check the wiki: https://github.com/beefy/textmmo/wiki"
        });
    }

    socket.on('error', (error) => {console.log(error);});

    socket.on('connect', function (event) {
        connected = true;
        log('Connected');

        socket.emit('login', {
            username: username,
            password: password,
            reconnection: true
        });
    });

    socket.on('disconnect', function () {
        log("Disconnected, attempting to reconnect")
    });

    // listen for login success or failure
    socket.addEventListener('message', function(event) {
        if(event.login_success) {
            log("Login Successful");
            // stop listening for login success

            help_message()
            $loginPage.fadeOut();
            $chatPage.show();
            // $ad.show();
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
