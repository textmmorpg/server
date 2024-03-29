const SEEING_DISTANCE = 5;
const HEARING_DISTANCE = 5;
const HEARING_DISTANCE_QUIET = 2;
const HEARING_DISTANCE_LOUD = 15;
const REPORT_DISTANCE = HEARING_DISTANCE_LOUD;
const ATTACK_DISTANCE = 5;
const PUNCH_DAMAGE = 0.1;
const PUNCH_ENERGY = 0.05
const ONE_METER = Math.PI/250
const WALK_SPEED = 1;
const SWIM_SPEED = 1;
const RUN_SPEED = 2;
const NORTH = Math.PI/2;
const SOUTH = Math.PI*1.5;
const EAST = 0;
const WEST = Math.PI;
const FIELD_OF_VIEW = Math.PI/2;
const ONE_WEEK = 7 * 24 * 60 * 60 * 1000;
const ALMOST_ONE_WEEK = 7 * 20 * 60 * 60 * 1000;

module.exports = {
    SEEING_DISTANCE,
    HEARING_DISTANCE,
    HEARING_DISTANCE_QUIET,
    HEARING_DISTANCE_LOUD,
    REPORT_DISTANCE,
    ATTACK_DISTANCE,
    PUNCH_DAMAGE,
    PUNCH_ENERGY,
    ONE_METER,
    WALK_SPEED,
    SWIM_SPEED,
    RUN_SPEED,
    NORTH,
    SOUTH,
    EAST,
    WEST,
    FIELD_OF_VIEW,
    ONE_WEEK,
    ALMOST_ONE_WEEK,
}
