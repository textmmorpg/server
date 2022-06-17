module.exports = {
    distance,
}

function distance(p1, p2) {
    // each point is [height, lat, long]
    return Math.sqrt(
        Math.pow(p1[0], 2) + Math.pow(p2[0], 2) -
        2*p1[0]*p2[0]*(
            Math.sin(p1[1])*Math.sin(p2[1])*
            Math.cos(p1[2]-p2[2]) +
            Math.cos(p1[1])*Math.cos(p2[2])
        )
    )
}
