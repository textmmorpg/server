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

// write output to canvas
var counter = 0
for(var lat = 0; lat < width; lat++) {
  for(var long = 0; long < height; long++) {
      context.fillStyle = randomGreyHex(noise[counter]);
      context.fillRect(lat, long, 1, 1);
      counter += 1;
  }
}

const buffer2 = canvas.toBuffer('image/png')
fs.writeFileSync('./terrain.png', buffer2)
