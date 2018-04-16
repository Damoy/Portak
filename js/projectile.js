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
	constructor(ctx, canvas, world, x, y, w, h, direction){
		super(ctx, canvas, world, x, y, w, h, "Pink", ProjectileContext.computeSpeedX(direction), ProjectileContext.computeSpeedY(direction));
		this.radius = computeRadius(1, 20);
		this.dead = false;
	}

	update(){
		if(!this.dead){
			this.addX(this.speedX);
			this.addY(this.speedY);
			this.checkPosition();
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

	die(){
		this.dead = true;
		// println("Projectile died: " + this.x + ", " + this.y + ", r: " + this.getRow() + ", c: " + this.getCol());
	}

	isDead(){return this.dead;}
}