var ProjectileContext = {
	computeSpeedX : function(direction){
		switch(direction){
			case PlayerContext.getLeftDirValue():
				return -4;
			case PlayerContext.getRightDirValue():
				return 4;
			default:
				return 0;
		}
		return 0;
	},

	computeSpeedY : function(direction) {
		switch(direction){
			case PlayerContext.getUpDirValue():
				return -4;
			case PlayerContext.getDownDirValue():
				return 4;
			default:
				return 0;
		}
		return 0;
	}
};

class Projectile extends Entity{
	constructor(ctx, canvas, world, x, y, w, h, direction, color){
		super(ctx, canvas, world, x, y, w, h, color, ProjectileContext.computeSpeedX(direction), ProjectileContext.computeSpeedY(direction));
		this.radius = computeRadius(1, 10);
		this.dead = false;
		this.walls = this.level.getWalls();
	}

	update(){
		if(!this.dead){
			this.addX(this.speedX);
			this.addY(this.speedY);
			this.checkPosition();
			this.updateBox();
			this.checkWallsCollision();
		}
	}

	render(){
		if(this.dead)
			return;

		ctx.save();
		ctx.beginPath();
    	ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    	ctx.fillStyle = this.color;
    	ctx.fill();
    	ctx.stroke();
    	ctx.restore();
	}

	checkPosition(){
		if(this.x < 0 || this.x > RenderingContext.getCanvasWidth(this.canvas) || this.y < 0 || this.y > RenderingContext.getCanvasHeight(this.canvas)) {
			this.die();
		}
	}

	checkWallsCollision(){
		for(let i = 0; i < this.walls.length; i++){
			let wall = this.walls[i];
			let x = wall.getX();
			let y = wall.getY();
			let h = wall.getH();
			let w = wall.getW();
			if(this.collides(x,y,w,h)){
				this.dead = true;
				this.level.removeEnemy(wall);
				this.level.getMap().getNormTileAt(x,y).forgetEnemy();
				return;
			}
		}
	}

	die(){
		this.dead = true;
		// println("Projectile died: " + this.x + ", " + this.y + ", r: " + this.getRow() + ", c: " + this.getCol());
	}

	isDead(){return this.dead;}
}