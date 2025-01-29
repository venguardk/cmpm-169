// declaration
let quadtree;
let boundary;
let capacity = 4;
let num = 1000;
let radius = 5;

let particles = [];

function setup() {
  createCanvas(400, 400);
  
  for (let i=0; i<num; i++){
    particles[i] = new Particle(random(width), random(height));
  }

  boundary = new Rect(width/2, height/2, width/2, height/2); // middle of canvas
  quadtree = new Quadtree(boundary, capacity);
}

function draw() {
  background(220);
  // print(frameRate());

  quadtree.clearQuadtree();

  // inserting points
  for (let i = 0; i < num; i++){
    let p = new Point(particles[i].x, particles[i].y, particles[i]);
    quadtree.insert(p);
    
    // displaying particles
    particles[i].update();
    particles[i].display();
    particles[i].collided = false;
  }

  // checking if particles collided
  for (let i= 0; i<particles.length; i++){
    // setting range
    let range = new Circle(particles[i].x, particles[i].y, particles[i].r);
    let foundPoints = [];
    quadtree.query(range, foundPoints);
  
    for(let j= 0; j<foundPoints.length; j++){
      let p = foundPoints[j].userData;
      // making sure not the same particle
      if (particles[i] != p && particles[i].collides(p)){  
        particles[i].collided = true;
      }
    }
  }

  // let range = new Rect(mouseX, mouseY, 40, 40);
  // noFill();
  // stroke(0, 255, 0);
  // rect(range.x, range.y, range.w * 2, range.h * 2);

  // let range = new Circle(mouseX, mouseY, 40);
  // noFill();
  // stroke(0, 255, 0);
  // ellipse(range.x, range.y, range.r * 2, range.r * 2);
  
  // let foundPoints = [];

  // quadtree.query(range,foundPoints);
  // quadtree.display();
  // for (let i=0; i<foundPoints.length; i++){
  //   noStroke();
  //   fill(255, 255, 0);
  //   ellipse(foundPoints[i].x, foundPoints[i].y, 10, 10);
  // }
}
