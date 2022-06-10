const fs = require('fs');
const { createCanvas } = require('canvas');

const width = 360;
const height = 360;
const canvas = createCanvas(width, height);
const context = canvas.getContext('2d');

var cell_centers = new Array();
var cell_colors = new Array();

function randomColorHex(x, y) {
    // bitwise OR. Gives value in the range 0-255
    // which is then converted to base 16 (hex).
    var r = (Math.random()*(256)|0).toString(16);
    var g = (Math.random()*(256)|0).toString(16);
    var b = (Math.random()*(256)|0).toString(16);
    return "#" + r + g + b;
}

function distance(x1, y1, x2, y2) {
    return Math.sqrt(
        Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)
    )
}

// voronoi algorithm
function get_closest_center(lat, long) {
    var smallest_distance_amount = Number.MAX_SAFE_INTEGER;
    var smallest_distance_index;
    cell_centers.forEach( (center, index) => {
        var cur_distance = distance(
            center[0], center[1], lat, long
        );
        if(cur_distance < smallest_distance_amount) {
            smallest_distance_index = index;
            smallest_distance_amount = cur_distance;
        }
    })
    return smallest_distance_index;
}

// get cell centers
for(var lat = 0; lat < width; lat++) {
    for(var long = 0; long < height; long++) {
        if(Math.random() > 0.9) {
            cell_centers.push([lat, long]);
            cell_colors.push(randomColorHex(lat, long))
            context.fillStyle = '#FFF';
            context.fillRect(lat, long, 1, 1);
        }
    }
}

// fill cell not-centers
for(var lat = 0; lat < width; lat++) {
    for(var long = 0; long < height; long++) {
        if(Math.random() <= 0.9) {
            var closest_center = get_closest_center(lat, long);
            context.fillStyle = cell_colors[closest_center];
            context.fillRect(lat, long, 1, 1);
        }
    }
}

const buffer1 = canvas.toBuffer('image/png');
fs.writeFileSync('./biome_cells.png', buffer1);
