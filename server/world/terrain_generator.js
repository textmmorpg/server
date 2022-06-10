var perlin = require('perlin-noise');
const fs = require('fs');
const { createCanvas } = require('canvas');

const width = 500;
const height = 500;
const canvas = createCanvas(width, height);
const context = canvas.getContext('2d');

function randomGreyHex(value) {
  // bitwise OR. Gives value in the range 0-255
  // which is then converted to base 16 (hex).
  var v = (value*(256)|0).toString(16);
  return "#" + v + v + v;
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
blur(5);


// write output to canvas
for(var lat = 0; lat < width; lat++) {
  for(var long = 0; long < height; long++) {
      context.fillStyle = randomGreyHex(values[lat][long]);
      context.fillRect(lat, long, 1, 1);
  }
}

const buffer2 = canvas.toBuffer('image/png')
fs.writeFileSync('./terrain.png', buffer2)
