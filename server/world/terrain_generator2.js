const fs = require('fs');
const { createCanvas } = require('canvas');
var perlin = require('perlin-noise');

const width = 1000;
const height = 1000;
const canvas = createCanvas(width, height);
const context = canvas.getContext('2d');

function greyHex(value) {
  // bitwise OR. Gives value in the range 0-255
  // which is then converted to base 16 (hex).
  var v = (value*(256)|0).toString(16);
  return "#" + v + v + v;
}

// create 2d array for the heightmap
var values = new Array();
for(var lat = 0; lat < width; lat++) {
  values.push(new Array(height));
  for(var long = 0; long < height; long++) {
    values[lat][long] = 0.5
  }
}

function midpoint(point1, point2) {
    return [Math.floor((point1[0]+point2[0])/2), Math.floor((point1[1]+point2[1])/2)];
}

function create_ridge(points, iter) {
    if(iter <= 0) return;
    var cur_midpoint = midpoint(points[0], points[1]);
    var h = (values[points[0][0]][points[0][1]] + values[points[1][0]][points[1][1]])/2;
    var new_h = h + (Math.random()-0.5);
    // if(new_h > 1) new_h = 1;
    // if(new_h < 0) new_h = 0;
    values[cur_midpoint[0]][cur_midpoint[1]] = new_h
    // iterate with new midpoints recursively
    var new_points = [
        midpoint(points[0], cur_midpoint),
        midpoint(points[1], cur_midpoint)
    ]
    create_ridge(new_points, iter-1);
}


var noise = perlin.generatePerlinNoise(width, height);

// convert to 2d array
var counter = 0;
var values = new Array();
for(var lat = 0; lat < width; lat++) {
  values.push(new Array(height));
  for(var long = 0; long < height; long++) {
    values[lat][long] = noise[counter];
    counter += 1;
  }
}

for(var x = 0; x < width; x++) {
    for(var y = 0; y < height; y++) {
        if(Math.random() > 0.5) create_ridge([[x, y], [0, 0]], 30)
        if(Math.random() > 0.5) create_ridge([[x, y], [width-1, height-1]], 30)
        if(Math.random() > 0.5) create_ridge([[x, y], [width-1, 0]], 30)
        if(Math.random() > 0.5) create_ridge([[x, y], [0, height-1]], 30)
        if(Math.random() > 0.5) create_ridge([[x, y], [
            Math.floor(Math.random()*(width-1)), 
            Math.floor(Math.random()*(height-1))
        ]], 30)
    }
}

// apply gaussian blur
function blur(size) {
    var border = Math.floor(size/2);
    for(var lat = border; lat < width-border; lat++) {
        for(var long = border; long < height-border; long++) {
            // create filter of size <size>
            var filter = new Array();
            for(var x = -1*border; x < border+1; x++) {
              for(var y = -1*border; y < border+1; y++) {
                filter.push(values[lat+x][long+y]);
              }
            }
            // assign cell the average size of neighbors
            values[lat][long] = filter.reduce((a, b) => a + b, 0)/filter.length;
        }
    }
}
blur(15);

// write output to canvas
for(var lat = 0; lat < width; lat++) {
  for(var long = 0; long < height; long++) {
      context.fillStyle = greyHex(values[lat][long]);
      context.fillRect(lat, long, 1, 1);
  }
}

const buffer2 = canvas.toBuffer('image/png')
fs.writeFileSync('./terrain.png', buffer2)
