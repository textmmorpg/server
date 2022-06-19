
const config = require("../../config");
const { Vector } = require("simplevectorsjs");

module.exports = {
    is_close,
    within_distance,
    get_user_vectors
}

function get_user_vectors(
    user2_x, user2_y, user2_angle,
    user1_x, user1_y
) {
    var user1and2Vector = new Vector();
    var user2Vector = new Vector();
    user1and2Vector.fromTwoPoints([user2_x, user2_y, 0], [user1_x, user1_y, 0]);
    user2Vector.fromTwoPoints([user2_x, user2_y, 0], [
        user2_x + 1 * Math.cos(user2_angle),
        user2_y + 1 * Math.sin(user2_angle),
        0
    ]);
    return [user1and2Vector, user2Vector];
}

function within_distance(
    user1_x, user1_y,
    user2_x, user2_y, distance_limit
) {
    // check if they are too far away
    var distance = Math.sqrt(
        Math.pow(user2_x - user1_x, 2) +
        Math.pow(user2_y - user1_y, 2)
    );

    return distance < distance_limit
}

function is_close(user1, user2, distance, only_in_field_of_view) {

    var distance_ok = within_distance(
        user1["lat"], user1["long"],
        user2["lat"], user2["long"], distance
    )

    if(!distance_ok) {
        // too far away to hear/see the message
        return false;
    }
    
    var user_vectors = get_user_vectors(
        user2["lat"], user2["long"], user2["angle"],
        user1["lat"], user1["long"]
    )

    var user_angle = user_vectors[0].angle(user_vectors[1]) % Math.PI;
    var in_field_of_view = user_angle < config.FIELD_OF_VIEW/2
    return !only_in_field_of_view || in_field_of_view;
}
