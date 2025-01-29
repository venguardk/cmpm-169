/*
    Quadtree: a tree data structure in which each internal node has exactly four children.
    2D version of octrees; most often used to partition a two-dimensional space by recursively
    subdividing it into four quandrants or regions. 
*/

// the point we're going to insert within the boundary
class Point{
    constructor(x, y, userData){
        this.x = x;
        this.y = y;
        this.userData = userData;   
        // ^ could put particle class in, but doing this way makes more generic
    }
}

// creating circular boundary
class Circle{
    constructor(x, y, r){
        this.x = x;
        this.y = y;
        this.r = r;
    }

    // methods ==================================================================
    // distance between this.x or y to point.x or y is less than the radius
    contains(point){
        let distX = Math.abs(this.x - point.x);
        let distY = Math.abs(this.y - point.y);
        // distance formula = sqrt(distX^2 + distY^2
        let distance = Math.sqrt(Math.pow(distX, 2) + Math.pow(distY, 2));

        if (distance <= this.r){
            return true;
        }else{
            return false;
        }
    }

    // intersects between a circle and a rectangle
    intersects(boundary){
        // checking what direction rect is to circle
        let closeX = this.x;    // closest sides
        let closeY = this.y;    // ^

        if (closeX < boundary.x - boundary.w){    // rect on left side of circle
            closeX = boundary.x - boundary.w;
        } else if (closeX > boundary.x + boundary.w){ // rect on right
            closeX = boundary.x + boundary.w;
        }
        if (closeY > boundary.y + boundary.h){    // rect on top
            closeY = boundary.y + boundary.h;
        } else if (closeY < boundary.y - boundary.h){ // rect on bot
            closeY = boundary.y - boundary.h;
        }

        let distX = Math.abs(this.x - closeX);
        let distY = Math.abs(this.y - closeY);
        let distance = Math.sqrt(Math.pow(distX, 2) + Math.pow(distY, 2));

        if (distance <= this.r){
            return true;
        } else{
            return false;
        }
    }
}

// creating rectangular boundary
class Rect{
    constructor(x, y, w, h){
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    // methods ===================================================================
    // checks if point is within space
    contains(point){
        // point middle of rect, w,h half of rect
        if (point.x >= this.x - this.w &&       // point greater than left side
            point.x < this.x + this.w &&        // point less than right side
            point.y >= this.y - this.h &&       // point greater than bottom
            point.y < this.y + this.h){         // point less than top
                return true;
        }else{
            return false;
        }
    }

    // checks collision rect to rect
    intersects(boundary){
        // four sides of the boundary
        let boundaryR = boundary.x + boundary.w; // right
        let boundaryL = boundary.x - boundary.w; // left
        let boundaryT = boundary.y - boundary.h; // top
        let boundaryB = boundary.y + boundary.h; // bottom
        // four sides of rect
        let rangeR = this.x + this.w; // right
        let rangeL = this.x - this.w; // left
        let rangeT = this.y - this.h; // top
        let rangeB = this.y + this.h; // bottom
        // boundary & rect overlap
        if (boundaryR >= rangeL &&
            boundaryL <= rangeR &&
            boundaryT <= rangeB &&
            boundaryB >= rangeT){
                return true;
        } else{
            return false;
        }
    }
}

class Quadtree{
    constructor(boundary, capacity){
        this.boundary = boundary; // the range of space
        this.capacity = capacity; // number of points in a particular boundary
        this.points = []; // array, keeps track of points in a particular boundary
        this.divided = false;
    }

    // metehods ===================================================================
    // clears quadtree
    // might not be the most efficient
    clearQuadtree(){
        this.points = [];
        this.divided = false;
    }
    
    // insert a point within boundary
    insert(point){
        if (!this.boundary.contains(point)){
            return false;
        }

        if (this.points.length < this.capacity){    // inserts a point inside boundary
            this.points.push(point);
            return true;
        } else{
            if (!this.divided){
                this.subdivide();   // dividing into quandrants
            }

            if (this.northeast.insert(point)){
                return true;
            } else if (this.northwest.insert(point)){
                return true;
            } else if ( this.southeast.insert(point)){
                return true;
            } else if (this.southwest.insert(point)){
                return true;
            }
        }
        return false;
    }

    // subdivide square into smaller squares
    subdivide(){
        // top left = nw; top right = ne; bot left = sw; bot right = se
        let x = this.boundary.x;
        let y = this.boundary.y;
        let w = this.boundary.w;
        let h = this.boundary.h;

        let northeastBoundary = new Rect(x + w/2, y - h/2, w/2, h/2);
        this.northeast = new Quadtree(northeastBoundary, this.capacity); 
        let northwestBoundary = new Rect(x - w/2, y - h/2, w/2, h/2);
        this.northwest = new Quadtree(northwestBoundary, this.capacity); 
        let southeastBoundary = new Rect(x + w/2, y + h/2, w/2, h/2);
        this.southeast = new Quadtree(southeastBoundary, this.capacity);
        let southwestBoundary = new Rect(x - w/2, y + h/2, w/2, h/2);
        this.southwest = new Quadtree(southwestBoundary, this.capacity);  

        this.divided = true;
    }

    // method used to find a point in a particular range
    // inputs: range = area to check; found = array to add points found
    query(range, found){
        if (!range.intersects(this.boundary)){   // is the range within the boundary
            return false;
        } else{
            for (let i=0; i<this.points.length; i++){   // adding point to found
                if (range.contains(this.points[i])){
                    found.push(this.points[i]);
                }
            }
            //if this boundary is already divided,then we want to call quandary again
            if (this.divided){
                this.northeast.query(range, found);
                this.northwest.query(range, found);
                this.southeast.query(range, found);
                this.southwest.query(range, found);
            }
        }
        return found;
    }

    // visualize in sketch
    display(){
        noFill();
        stroke(0);
        rectMode(CENTER);
        rect(this.boundary.x, this.boundary.y, this.boundary.w * 2, this.boundary.h *2);

        // drawing out points
        for (let i = 0; i < this.points.length; i++){
            noStroke();
            fill(0, 0, 255);
            ellipse(this.points[i].x, this.points[i].y, 10, 10);
        }

        if (this.divided){
            this.northeast.display();
            this.northwest.display();
            this.southeast.display();
            this.southwest.display(); 
        }

    }
}

