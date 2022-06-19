const SEEING_DISTANCE = 5;
const HEARING_DISTANCE = 5;
const HEARING_DISTANCE_QUIET = 2;
const HEARING_DISTANCE_LOUD = 15;
const ATTACK_DISTANCE = 4;
const PUNCH_DAMAGE = 0.1;
const ONE_METER = Math.PI/300
const WALK_SPEED = 1;
const SWIM_SPEED = 1;
const RUN_SPEED = 2;
const NORTH = Math.PI/2;
const SOUTH = Math.PI*1.5;
const EAST = 0;
const WEST = Math.PI;
const FIELD_OF_VIEW = 1.178097; // 135 degrees (half of that in each direction)

module.exports = {
    SEEING_DISTANCE,
    HEARING_DISTANCE,
    HEARING_DISTANCE_QUIET,
    HEARING_DISTANCE_LOUD,
    ATTACK_DISTANCE,
    PUNCH_DAMAGE,
    ONE_METER,
    WALK_SPEED,
    SWIM_SPEED,
    RUN_SPEED,
    NORTH,
    SOUTH,
    EAST,
    WEST,
    FIELD_OF_VIEW
}
