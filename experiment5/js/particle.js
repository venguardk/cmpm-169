class particle{
    constructor(pos){
        this.p = pos;
    }

    show(){
        strokeWeight(random(3, 5));
        stroke(255);
        point(this.p.x, this.p.y, this.p.z);
    }

    move(){

    }
}