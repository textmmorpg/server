const db = require('./db').get_db();
const crud_user = require('./user');

module.exports = {
    create_corpse,
    attack
}

async function create_corpse(socket) {
    await crud_user.get_user(socket.id).catch(console.dir).then( (user) => {
        db.collection('corpse').insertOne({
            lat: user["lat"], long: user["long"], height: user["height"],
            age: user["age"], tall: user["tall"], weight: user["weight"],
            time_of_death: new Date()
        });
    });
}

// reduce health and possibly knock down victim
async function attack(attacker, victim, damage, energy) {
    await db.collection('user').updateOne({
        socket_id: attacker['socket_id']
    }, {
        $set: {energy: attacker['energy'] - energy}
    });

    await db.collection('user').updateOne({
        socket_id: victim['socket_id']
    }, {
        $set: {health: victim['health'] - damage}
    });
}
