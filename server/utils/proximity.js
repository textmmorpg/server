
const config = require("../../config");
const { Vector } = require("simplevectorsjs");

module.exports = {
    get_perspective
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
    // TODO: fix for spherical planet / modulus
    // check if they are too far away
    var distance = Math.sqrt(
        Math.pow(user2_x - user1_x, 2) +
        Math.pow(user2_y - user1_y, 2)
    );

    return distance < distance_limit
}

function get_perspective_message(user1, user2) {

    var user_vectors = get_user_vectors(
        user2["lat"], user2["long"], user2["angle"] % (Math.PI * 2),
        user1["lat"], user1["long"]
    )

    var user_angle = user_vectors[0].angle(user_vectors[1]) % (Math.PI * 2);

    // TODO: if the other player is faceing towards you or away from you
    // their left and right are switched ("the player in front of you walked left vs right"
    // changes depending on which way that player is facing)

    var direction_vector = user_vectors[0].cross(user_vectors[1]);
    // TODO: replace this vector library / do the math with only Math utils

    // Cross product determines if the other point is to the right
    // or the left. Consider the right hand rule from physics. 
    // Going one direction the thumb points up, going the other 
    // direction the thumb points down. The thumb is the cross product
    // so we check if the z axis is positive or negative.
    var cross_product_values = direction_vector.toString();
    var is_left =  cross_product_values[2] < 0;
    var direction_str = is_left? 'left': 'right';

    if ( user_angle < Math.PI/10 ) {
        return 'in front of you';
    } else if ( user_angle < Math.PI/4 ) {
        return 'to the ' + direction_str + ' of you';
    } else if ( user_angle < config.FIELD_OF_VIEW ) {
        return 'to the far ' + direction_str + ' of you';
    } else if ( user_angle < (3*Math.PI)/4 ) {
        return 'behind you to the ' + direction_str;
    } else {
        return 'behind you'
    }
}

function get_perspective(user1, user2, distance, check_behind) {

    var distance_ok = within_distance(
        user1["lat"], user1["long"],
        user2["lat"], user2["long"], distance
    )

    if(!distance_ok) {
        // too far away to hear/see the message
        return false;
    }
    
    var perspective = get_perspective_message(user1, user2);
    if(check_behind && perspective.startsWith("behind you")) {
        // out of field of view so they cannot see it
        return false;
    }

    return perspective;
}
