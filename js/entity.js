/*

  ------ Entity ------

*/

var EntityContext = {
	getBaseX : function(){return 0;},
	getBaseY : function(){return 0;},
	getBaseColor : function(){return "pink";},
	getBaseW : function(){return 20;},
	getBaseH : function(){return 20;},
	getBaseBox : function(){return new AABB(0, 0, 0, 0);}
}

class Entity {
	constructor(ctx, canvas, world, x, y, w, h, color, speedX, speedY){
		this.ctx = ctx;
		this.canvas = canvas;
		this.world = world;
		this.level = this.world.getCurrentLevel();
		// this.map = this.level.getMap();

		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;

		this.color = color || EntityContext.getBaseColor();
		this.savedColor = this.color;
		this.speedX = speedX;
		this.speedY = speedY;

		this.box = new AABB(this.x, this.y, this.w, this.h) || EntityContext.getBaseBox();
		this.syncBoxRequired = true;
		this.requireBoxSync();
	}

	// updating
	update(){

	}

	// rendering with ctx attribute
	render(){

	}

	// reset the entity color
 	resetColor(){
 		this.color = this.savedColor;
 	}

 	 updateBox(){
		if(this.syncBoxRequired){
			this.box.setX(this.x);
			this.box.setY(this.y);
			this.box.setW(this.w);
			this.box.setH(this.h);
			this.syncBoxRequired = false;
		}
	}
	
	collides(aabb){return this.box.collides(aabb);}
	collides(entity){return this.box.collides(entity.getBox());}
	collides(x2, y2, w2, h2){return this.box.collides(x2, y2, w2, h2);}
	requireBoxSync(){this.syncBoxRequired = true;}
	getBox(){return this.box;}

 	//---- GET

	getX(){return this.x;}
	getY(){return this.y;}
	getW(){return this.w;}
	getH(){return this.h;}
	getRow(){return MapContext.getTileRow(this.y);}
	getCol(){return MapContext.getTileCol(this.x);}
	getSpeedX(){return this.speedX;}
	getSpeedY(){return this.speedY;}

	getColor(){return this.color;}
	getSavedColor(){return this.savedColor;}
	getContext(){return this.ctx;}
	getCanvas(){return this.canvas;}
	getWorld(){return this.world;}
	getLevel(){return this.level;}
	// getMap(){return this.map;}

 	//---- SET

 	moveTo(x, y){
 		this.x = x;
 		this.y = y;
 		this.requireBoxSync();
 	}

 	setX(x) {
 		this.x = x;
 		this.requireBoxSync();
 	}

 	setY(y) {
 		this.y = y;
 		this.requireBoxSync();
 	}

 	setW(w) {
 		this.h = h;
 		this.requireBoxSync();
 	}

 	setH(h) {
 		this.w = w;
 		this.requireBoxSync();
 	}

 	setColor(color) {this.color = color;}
 	setSpeedX(sx){this.speedX = sx;}
 	setSpeedY(sy){this.speedY = sy;}

 	//---- 

 	addX(dx){
 		this.x += dx;
 		this.requireBoxSync();
 	}

 	addY(dy){
 		this.y += dy;
 		this.requireBoxSync();
 	}

 	subX(dx){
 		this.x -= dx;
 		this.requireBoxSync();
 	}

 	subY(dy){
 		this.y -= dy;
 		this.requireBoxSync();
 	}

}