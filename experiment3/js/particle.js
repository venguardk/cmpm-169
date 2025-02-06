class Particle{
    constructor(x, y){
        this.x = x; 
        this.y = y;
        this.r = radius;
        // velocity
        this.vx = random(-2, 2);
        this.vy = random(-2, 2);

        this.collided = false;
    }

    // bounces off borders
    checkEdges(){
        // reverses velocity when reaching borders
        if (this.x > width || this.x < 0){
            this.vx *= -1;
        }
        if (this.y > height || this.y < 0){
            this.vy *= -1;
        }
    }

    // moving
    update(){
        this.checkEdges();
        this.x += this.vx;
        this.y += this.vy;
    }

    // collision detection
    // param: another particle
    collides(particle){
        let distance = dist(this.x, this.y, particle.x, particle.y);
        if (distance <= this.r + particle.r){
            return true;
        }else{
            return false;
        }
    }

    display(){
        if (this.collided){
            fill(255, 0, 0);
        }else{
            fill(0);
        }
        noStroke();
        ellipse(this.x, this.y, this.r * 2, this.r *2);
    }
}
