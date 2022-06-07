const crud = require('./crud');

module.exports = {
    login,
    signup
}

function login(data, socket) {
    // check if credentials exist / are correct
    crud.get_login(
        data['username'], data['password']
    ).catch(console.dir).then( (user) => {
        if(user === null) {
            // either the username doesn't exist
            // or the password is wrong
            socket.send({login_success: false});
        } else {
            // user found -> login successful
            user_id = user['user_id'];
            crud.add_connection(user_id, socket.id).catch(console.dir);
            socket.send({login_success: true});
        }
    });
}

function signup(data, socket) {
    // check if that username already exists
    crud.check_username(data["username"]).catch(console.dir).then( (response) => {
      if(response > 0) {
        // that username already exists -> signup failure
        socket.send({login_success: false});
      } else {
        // username is not taken -> signup success
        crud.create_user(data["username"], data["password"]).catch(console.dir);
        socket.send({login_success: true});
      }
    })
}
