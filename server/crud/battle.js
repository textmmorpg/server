const db = require('./db').get_db();
const crud_user = require('./user');

module.exports = {
    create_corpse
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
