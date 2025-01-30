/*
    Boid implementation 
    Behaviors etc.
*/
// variables
// let perceptionRadius = 30;  // view of boid

class Boid{
    constructor(x, y){
        this.position = createVector(x, y);
        this.velocity = p5.Vector.random2D(); // outputs a random vector value
        this.velocity.mult(random(-3, 3));
        this.acceleration = createVector(0, 0);
        this.maxSpeed = 3;
        this.maxForce = 0.2;
        this.r = radius;

        this.collided = false;
    }

    // looping canvas edges
    edges(){
        if (this.position.x > width){
            this.position.x = 0;
        } else if (this.position.x < 0){
            this.position.x = width;
        }

        if (this.position.y > height){
            this.position.y = 0;
        } else if (this.position.y < 0){
            this.position.y = height;
        }
    }

    // behaviors ===========================================================
    alignment(boids){
        let steering = createVector();  // steering force
        let total = 0;                  // counting num of neighbors in flock

        for (let i=0; i<boids.length; i++){
            let distance = dist(this.position.x, this.position.y, boids[i].position.x, boids[i].position.y);
            // checks if boid is neighbor & distance of specific neighbor within a radius
            if (boids[i] != this && distance < perceptionRadius){
                // desired velocity = sum of all velocity
                steering.add(boids[i].velocity);
                total += 1;
            }
        }
        // if there is a neighbor, get steering force via accel that changes vel to desired vel
        if (total > 0){
            steering.div(total);    // avg vel
            steering.setMag(this.maxSpeed); // setting magnitude in case div is too large or small
            steering.sub(this.velocity);    // steering - current vel
            steering.limit(this.maxForce);    // setting limit to force of steering output
        }
        return steering;
    }

    // want to find center of mass  = avg pos of all neighbors / total#
    // desired vel = current input to travel to COM
    cohesion(boids){
        let steering = createVector();  // steering force
        let total = 0;                  // counting num of neighbors in flock

        for (let i=0; i<boids.length; i++){
            let distance = dist(this.position.x, this.position.y, boids[i].position.x, boids[i].position.y);
            // checks if boid is neighbor & distance of specific neighbor within a radius
            if (boids[i] != this && distance < perceptionRadius){
                steering.add(boids[i].position);
                total += 1;
            }
        }

        if (total > 0){
            steering.div(total);    // center of mass 
            steering.sub(this.position);    // direction of current input to COM
            steering.setMag(this.maxSpeed);
            steering.sub(this.velocity);    // steering force
            steering.limit(this.maxForce);
        }

        return steering;
    }

    /*
        Need to look at the distance of neigbhors traveling towards boid
        The closer, the higher the influence; the farther, the lower the influence
    */
    separation(boids){
        let steering = createVector();  // steering force
        let total = 0;                  // counting num of neighbors in flock

        for (let i=0; i<boids.length; i++){
            let distance = dist(this.position.x, this.position.y, boids[i].position.x, boids[i].position.y);
            // checks if boid is neighbor & distance of specific neighbor within a radius
            if (boids[i] != this && distance < perceptionRadius){
                // p5.Vector.sub calls method that makes a new vect from 2 vect
                let neighborVect = p5.Vector.sub(this.position, boids[i].position); 
                // the farther, the larger the number divided by i.e. less influence
                neighborVect.div(distance * distance); // neighbor / dist^2
                steering.add(neighborVect); // the velocity needed to travel away
                total += 1;
            }
        }

        if (total > 0){
            steering.div(total);    // desired vel
            steering.setMag(this.maxSpeed); // max speed
            steering.sub(this.velocity);    // steering force
            steering.limit(this.maxForce);  // limiting
        }
        
        return steering;
    }

    collision(boids){
        for (let i=0; i<boids.length; i++){
            let distance = dist(this.position.x, this.position.y, boids[i].position.x, boids[i].position.y);
            if (boids[i] != this && distance <= this.r + boids[i].r){
                return true;
            }else{
                return false;
            }
        }
        
    }

    // calls 3 behavioral methods to get steering vector
    // add steering vectors with acceleration
    flock(boids){
        let alignment = this.alignment(boids);
        let cohesion = this.cohesion(boids);
        let separation = this.separation(boids);

        this.acceleration.add(alignment);
        this.acceleration.add(cohesion);
        this.acceleration.add(separation);
    }

    update(){
        this.edges();
        this.position.add(this.velocity);   // add 2 vectors
        this.velocity.add(this.acceleration);
        this.acceleration.mult(0);
    }

    display(){
        noStroke();
        fill(255);
        ellipse(this.position.x, this.position.y, this.r*2, this.r*2);
    }

}