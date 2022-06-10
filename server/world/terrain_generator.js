const fs = require('fs');
const { createCanvas } = require('canvas');
var perlin = require('perlin-noise');

const width = 300;
const height = 300;
const canvas = createCanvas(width, height);
const context = canvas.getContext('2d');

function greyHex(value) {
  // bitwise OR. Gives value in the range 0-255
  // which is then converted to base 16 (hex).
  var v = (value*(256)|0).toString(16);
  return "#" + v + v + v;
}

function colorHex(value) {
  // bitwise OR. Gives value in the range 0-255
  // which is then converted to base 16 (hex).
  if(value > 0.07) {
    return "#03007B"; // dark blue
  } else if(value > 0.045) {
    return "#6663FF"; // light blue
  } else if(value > 0.04) {
    return "#BFBA07"  // yellowy/orange
  } else if(value > 0.02) {
    return "#07A804" // light green
  } else if(value > 0.01) {
    return "#0B5B02" // dark green
  } else {
    return "#787A6B";
  }
}

var noise = perlin.generatePerlinNoise(width, height);

// create 2d array for the heightmap
var values = new Array();
var counter = 0;
for(var lat = 0; lat < width; lat++) {
  values.push(new Array(height));
  for(var long = 0; long < height; long++) {
    if(Math.random > 0.99) {
        values[lat][long] = noise[counter]
    } else {
        values[lat][long] = 0
    }
    counter += 1;
  }
}

function midpoint(point1, point2) {
    return [Math.floor((point1[0]+point2[0])/2), Math.floor((point1[1]+point2[1])/2)];
}

function create_ridge(points, iter) {
    if(iter <= 0) return;
    var cur_midpoint = midpoint(points[0], points[1]);
    var h = (values[points[0][0]][points[0][1]] + values[points[1][0]][points[1][1]])/2;
    var new_h = h + Math.random()-0.5;
    values[cur_midpoint[0]][cur_midpoint[1]] = new_h
    // iterate with new midpoints recursively
    var new_points = [
        midpoint(points[0], cur_midpoint),
        midpoint(points[1], cur_midpoint)
    ]
    create_ridge(new_points, iter-1);
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
    var new_values = values;
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
            new_val = filter.reduce((a, b) => a + b, 0)/filter.length;
            if(new_val > 1) new_val = 0.999;
            if(new_val < 0) new_val = 0.001;
            new_values[lat][long] = new_val;
        }
    }

    return new_values;
}
values = blur(15);
values = blur(3);
values = blur(15);
values = blur(15);

// write output to canvas
var border = Math.floor(21/2)
for(var lat = border; lat < width-border; lat++) {
  for(var long = border; long < height-border; long++) {
      context.fillStyle = greyHex(values[lat][long]);
      context.fillRect(lat, long, 1, 1);
  }
}

const buffer1 = canvas.toBuffer('image/png')
fs.writeFileSync('./terrain.png', buffer1)

// write output to canvas
var border = Math.floor(21/2)
for(var lat = border; lat < width-border; lat++) {
  for(var long = border; long < height-border; long++) {
      context.fillStyle = colorHex(values[lat][long]);
      context.fillRect(lat, long, 1, 1);
  }
}

const buffer2 = canvas.toBuffer('image/png')
fs.writeFileSync('./terrain_colored.png', buffer2)
