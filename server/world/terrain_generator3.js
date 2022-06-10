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
    values[lat][long] = 0
  }
}

function randomNumber(min, max) { 
    return Math.random() * (max - min) + min;
} 

function distance(x1, y1, x2, y2) {
    return Math.sqrt(
        Math.pow(x2 - x1, 2) +
        Math.pow(y2 - y1, 2)
    )
}

function draw_circle(minx, miny, maxx, maxy, height, radius, iter) {
    if(iter > 5) return;
    var center = [randomNumber(minx, maxx), randomNumber(miny, maxy)];
    for(var x = 0; x < width; x++) {
        for(var y = 0; y < width; y++) {
            var cur_distance = distance(x, y, center[0], center[1]);
            if(cur_distance < radius) {
                values[x][y] = height;
            } 
        }
    }
    draw_circle(
        center[0]-radius/2, center[1]-radius/2, center[0]+radius/2, center[1]+radius/2,
        height*1.2, radius*0.5, iter+1);
}

draw_circle(0, 0, width-1, height-1, 0.5, 300, 0);

// write output to canvas
for(var lat = 0; lat < width; lat++) {
  for(var long = 0; long < height; long++) {
      context.fillStyle = greyHex(values[lat][long]);
      context.fillRect(lat, long, 1, 1);
  }
}

const buffer2 = canvas.toBuffer('image/png')
fs.writeFileSync('./terrain.png', buffer2)
