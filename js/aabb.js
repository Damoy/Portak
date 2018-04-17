// AABB singleton
var AABBContext = {
	getBaseX : function(){return 0;},
	getBaseY : function(){return 0;},
	getBaseW : function(){return 20;},
	getBaseH : function(){return 20;}
};

class AABB{
	constructor(x, y, w, h){
		this.x = x || AABBContext.getBaseX();
		this.y = y || AABBContext.getBaseY();
		this.w = w || AABBContext.getBaseW();
 	    this.h = h || AABBContext.getBaseH();
	}

	getX(){return this.x;}
	getY(){return this.y;}
	getW(){return this.w;}
	getH(){return this.h;}

	setX(x) {this.x = x;}
 	setY(y) {this.y = y;}
 	setW(w) {this.w = w;}
 	setH(h) {this.h = h;}

 	collides(aabb) {
 		let x2 = aabb.getX();
 		let y2 = aabb.getY();
 		let w2 = aabb.getW();
 		let h2 = aabb.getH();

  		return !((this.x > (x2 + w2)) ||
  				((this.x + this.w) < x2) ||
  				(this.y > (y2 + h2)) ||
  				((this.y + this.h) < y2));
	}

	collides(x2, y2, w2, h2){
  		return !((this.x > (x2 + w2)) ||
			((this.x + this.w) < x2) ||
			(this.y > (y2 + h2)) ||
			((this.y + this.h) < y2));
	}
}