const fs = require('fs');
const { createCanvas } = require('canvas');

const width = 50;
const height = 50;
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

function pairwise(array) {
    var result = new Array();
    array.forEach( (point1) => {
        array.forEach( (point2) => {
            if (point1 !== point2) {
                result.push([point1, point2]);
            }
        });
    });
    // remove duplicates like (x,y) and (y,x)
    result.forEach( (pair1, i1) => {
        result.forEach( (pair2, i2) => {
            if(pair1[0] === pair2[1] && pair1[1] === pair2[0]) {
                result.splice(i1, 1);
            }
        });
    });
    return result;
}

function midpoint(point1, point2) {
    return [Math.floor((point1[0]+point2[0])/2), Math.floor((point1[1]+point2[1])/2)];
}

function multiDimensionalUnique(arr) {
    var uniques = [];
    var itemsFound = {};
    for(var i = 0, l = arr.length; i < l; i++) {
        var stringified = JSON.stringify(arr[i]);
        if(itemsFound[stringified]) { continue; }
        uniques.push(arr[i]);
        itemsFound[stringified] = true;
    }
    return uniques;
}

// using a modified diamond square algorithm
points = [[0,0],[0,height-1],[width-1,0],[width-1,height-1]];
function get_all_midpoints(points) {
    // find all the midpoints
    var midpoints = new Array();
    // and store the average heights of the two points that generated them
    var heights = new Array();
    pairwise(points).forEach( (pair) => {
        height_avg = (values[pair[0][0]][pair[0][1]] + values[pair[1][0]][pair[1][1]])/2;
        midpoints.push(midpoint(pair[0], pair[1]));
        heights.push(height_avg);
    });
    // todo: remove duplicates before returning
    return [midpoints, heights];
}

function update_heights(points, heights) {
    points.forEach( (point, index) => {
        var new_height = heights[index] + (Math.random()-0.5)*0.2
        values[point[0]][point[1]] = new_height;
    })
}

var iter_count = 3;
for(var i = 0; i < iter_count; i++) {
    var midpoint_heights = get_all_midpoints(points);
    update_heights(midpoint_heights[0], midpoint_heights[1])
    points = midpoint_heights[0].concat(points);
}

// write output to canvas
for(var lat = 0; lat < width; lat++) {
  for(var long = 0; long < height; long++) {
      context.fillStyle = greyHex(values[lat][long]);
      context.fillRect(lat, long, 1, 1);
  }
}

const buffer2 = canvas.toBuffer('image/png')
fs.writeFileSync('./terrain.png', buffer2)
