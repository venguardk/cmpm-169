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
let angle = 0;
let monke;
let cloud;
let slider;
let slider2;
let particles = [];
let vertices = [];


class MyClass {
    constructor(param1, param2) {
        this.property1 = param1;
        this.property2 = param2;
    }

    myMethod() {
        // code to run when method is called
    }
}

function preload(){
  monke = loadModel("Wukong.obj");
  cloud = loadModel("Cloud.obj");
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
  let canvas = createCanvas(canvasContainer.width(), canvasContainer.height(), WEBGL);
  canvas.parent("canvas-container");
  // resize canvas is the page is resized

  // create an instance of the class
  myInstance = new MyClass("VALUE1", "VALUE2");

  $(window).resize(function() {
    resizeScreen();
  });
  resizeScreen();

  // cloud cluster
  for (let i of cloud.vertices){
    particles.push(new particle(createVector(random(-i.x,i.x), random(-i.y, i.y), random(-i.z,i.z))));
  }

  for (let i of cloud.vertices){
      vertices.push(new particle(createVector(i.x, i.y, i.z)));
  }

  slider = createSlider(0, 450);
  slider2 = createSlider(0, 450);
}

// draw() function is called repeatedly, it's the main animation loop
function draw() {
  background(0);
  var rotX = -PI/12;
  var rotY = -PI/6 + frameCount * 0.001;
  
  background(0);
  orbitControl(); // allows rotation
  ortho(-width/2, width/2, -height/2, height/2, -height*3, height*3);

  // slider

  if (width < 600) scale(width/600);

  rotateX(rotX);
  rotateY(rotY);
  ambientLight(100);
  directionalLight(255, 255, 255, 0, 0, -1);
  // rotateX(angle);
  // rotateY(angle * 1.3);
  // rotateZ(angle * 0.7);
  // rotateX(-30);

  push();
    stroke(255);
    strokeWeight(3);
    fill(0);
    scale(100);
    model(monke);
  pop();

  rotateY(-rotY);
  rotateX(-rotX);
  translate(0, 0, 0.3 + constrain(8 * (1 - 1.3 * slider.value()/width), 0, 8));
  rotateX(rotX);
  rotateY(rotY);

  push();
    noStroke();
    fill(0);
    scale(100);
    model(monke);
  pop();

  translate(0, 50, 0);
  scale(75, 50, 75);
  push();
    let c = color(255, 200, 68);
    fill(c);
    c.setAlpha(constrain(.8 * slider2.value(), 0, 255));
    scale(1.4 * slider2.value()/width);
    noStroke();
    model(cloud);
  pop();

  for (let i of particles){
    i.show();
  }

  for (let i of vertices){
    i.show();
  }
}

// mousePressed() function is called once after every time a mouse button is pressed
function mousePressed() {
    // code to run when mouse is pressed
}