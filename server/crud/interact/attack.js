const crud_user = require('../user/user');
const crud_battle = require('../battle');

module.exports = {
    perform_attack
}

function perform_attack(socket, io, user, other_user, damage, energy, perspective) {
    // notify attacker they hit their target
    // TODO: add perspective of the other player
    socket.send({data: 'Your punch hit the player in front of you!'})

    // notify victim they were hit
    io.to(other_user["socket_id"]).emit('message', {
        // TODO: Add perspective of what angle you were hit at ("you were punched from behind")
        data: 'Someone ' + perspective + ' punched you!'
    });

    // TODO: notify player when their health drops too far (ex: "You are close to death")
    // update health of victim and energy of attacker
    crud_battle.attack(
        user, other_user, damage, energy
    ).catch(console.dir).then( () => {
        // check if the attack killed them
        if(other_user["health"] < damage) {
            crud_user.respawn(other_user["socket_id"], io, 'a punch')
            // TODO: don't send this to the player that died
            // announce(socket.id, io, 'died from being punched', config.SEEING_DISTANCE, false);
            socket.send({data: 'Your punch was fatal!'});
        }
    });
    
    // TODO: random chance that the attack knocked the player down

    // TODO: announce to other players that the punch landed, but don't notify the victim
    //       because they already know they were hit
}
