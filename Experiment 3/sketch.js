// declarations
let boids = [];
let num = 1500;
let quadtree;
let boundary;
let capacity = 10;
let perceptionRadius = 30;  // view of boid
radius = 2;


function setup(){
  createCanvas(windowWidth, windowHeight);

  // setting up quadtree
  boundary = new Rect(width/2, height/2, width/2, height/2);
  quadtree = new Quadtree(boundary, capacity);

  // creating boid objs
  for (let i=0; i<num; i++){
    boids.push(new Boid(random(width), random(height)));
  }
}

function draw(){
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