
module.exports = {
    query_location
}

function query_location(lat, long, size) {
    var max_lat = lat + size;
    var min_lat = lat - size;
    var max_long = long + size;
    var min_long = long - size;
  
    var agg_lat = "$and";
    var agg_long = "$and";

    // extra logic for getting biomes looping around the world
    if(max_lat > Math.PI) {
        max_lat -= Math.PI;
        agg_lat = "$or";
    } else if(min_lat < 0) {
        min_lat += Math.PI;
        agg_lat = "$or";
    }

    if(max_long > Math.PI*2) {
        max_long -= Math.PI*2;
        agg_long = "$or";
    } else if(min_long < 0) {
        min_long += Math.PI*2;
        agg_long = "$or";
    }

    return [
        {[agg_lat]: [
            {lat: {$gte: min_lat}},
            {lat: {$lte: max_lat}},
        ]}, {[agg_long]: [
            {long: {$gte: min_long}},
            {long: {$lte: max_long}},
        ]}
    ]
}
