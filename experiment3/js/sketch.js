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

// declarations
let boids = [];
let num = 1500;
let quadtree;
let boundary;
let capacity = 10;
let perceptionRadius = 30;  // view of boid
radius = 2;


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
  myInstance = new MyClass("VALUE1", "VALUE2");

  $(window).resize(function() {
    resizeScreen();
  });
  resizeScreen();

  // setting up quadtree
  boundary = new Rect(width/2, height/2, width/2, height/2);
  quadtree = new Quadtree(boundary, capacity);

  // creating boid objs
  for (let i=0; i<num; i++){
    boids.push(new Boid(random(width), random(height)));
  }
}

// draw() function is called repeatedly, it's the main animation loop
function draw() {
  background(0);
  // print(frameRate());

  quadtree.clearQuadtree();

  for (let i=0; i<num; i++){ 
    let p = new Point(boids[i].position.x, boids[i].position.y, boids[i]);
    quadtree.insert(p);

    let range = new Circle(boids[i].position.x, boids[i].position.y, perceptionRadius);
    let neighbors = [];
    quadtree.query(range, neighbors);
 
    boids[i].flock(neighbors);
    boids[i].update();
    boids[i].display();
  }
  quadtree.display();
}

// mousePressed() function is called once after every time a mouse button is pressed
function mousePressed() {
    // code to run when mouse is pressed
}