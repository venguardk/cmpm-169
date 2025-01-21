// sketch.js - purpose and description here
// Author: Your Name
// Date:

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file
const VALUE1 = 1;
const VALUE2 = 2;

// Globals
let myInstance;
let canvasContainer;
var centerHorz, centerVert;

// my globals
let cols;
let rows;
let currBuff;
let prevBuff;

let dampening = 0.99;

class MyClass {
    constructor(param1, param2) {
        this.property1 = param1;
        this.property2 = param2;
    }

    myMethod() {
        // code to run when method is called
    }
}

function resizeScreen() {
  centerHorz = canvasContainer.width() / 2; // Adjusted for drawing logic
  centerVert = canvasContainer.height() / 2; // Adjusted for drawing logic
  console.log("Resizing...");
  resizeCanvas(canvasContainer.width(), canvasContainer.height());
  // redrawCanvas(); // Redraw everything based on new size
}

// setup() function is called once when the program starts
function setup() {
  // place our canvas, making it fit our container
  canvasContainer = $("#canvas-container");
  let canvas = createCanvas(canvasContainer.width(), canvasContainer.height());
  canvas.parent("canvas-container");
  // resize canvas is the page is resized

  // create an instance of the class
  // myInstance = new MyClass("VALUE1", "VALUE2");

  // $(window).resize(function() {
  //   resizeScreen();
  // });
  // resizeScreen();

  // my added setup
  pixelDensity(1);
  cols = width;
  rows = height;
  
  // buffers
  currBuff = new Array(cols).fill(0).map(n => new Array(rows).fill(0));
  prevBuff = new Array(cols).fill(0).map(n => new Array(rows).fill(0));
  
  // set shader
}


// draw() function is called repeatedly, it's the main animation loop
function draw() {
  background(88, 190, 237);

  // random raindrops
  prevBuff[floor(random(width - 2) + 1)][floor(random(height - 2) + 1)] = 10;
  
  // image processing algorithm checks surrounding pixels, adds them up, and subtract currBuff value
  loadPixels();
  for (let i = 1; i < cols - 1; i++) {
    for (let j = 1; j < rows - 1; j++) {
      currBuff[i][j] =
        (prevBuff[i - 1][j] +
          prevBuff[i + 1][j] +
          prevBuff[i][j - 1] +
          prevBuff[i][j + 1]) / 2 -
          currBuff[i][j];
      currBuff[i][j] = currBuff[i][j] * dampening;
    // setting colors for pixels
      let index = (i + j * cols) * 4;
      pixels[index + 0] = currBuff[i][j];
      pixels[index + 1] = currBuff[i][j] * 190;
      pixels[index + 2] = currBuff[i][j]* 237;
    }
  }
  updatePixels();
  
  let temp = prevBuff;
  prevBuff = currBuff;
  currBuff = temp;
}

// mousePressed() function is called once after every time a mouse button is pressed
function mousePressed() {
  prevBuff[mouseX][mouseY] = 50;
}

// ripple while dragging
function mouseDragged() {
  prevBuff[mouseX][mouseY] = 50;
}