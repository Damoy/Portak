var ProjectileContext = {
	computeSpeedX : function(direction){
		switch(direction){
			case AnimationContext.getLeftDirValue():
				return -4;
			case AnimationContext.getRightDirValue():
				return 4;
			default:
				return 0;
		}
		return 0;
	},

	computeSpeedY : function(direction) {
		switch(direction){
			case AnimationContext.getUpDirValue():
				return -4;
			case AnimationContext.getDownDirValue():
				return 4;
			default:
				return 0;
		}
		return 0;
	}
};

class Projectile extends Entity{
	constructor(ctx, canvas, world, x, y, w, h, direction, color, source){
		super(ctx, canvas, world, x, y, w, h, ProjectileContext.computeSpeedX(direction), ProjectileContext.computeSpeedY(direction));
		this.radius = computeRadius(1, 10);
		this.dead = false;
		this.color = color;
		this.source = source;
	}

	update(){
		if(!this.dead){
			this.addX(this.speedX);
			this.addY(this.speedY);
			this.checkPosition();
			this.updateBox();
			this.checkWallsCollision();
			this.checkEnemiesCollision();
			this.checkDoorsCollision();
		}
	}

	static collides(x, y, w, h, x2, y2, w2, h2){
		return !((x > (x2 + w2)) ||
		((x + w) < x2) ||
		(y > (y2 + h2)) ||
		((y + h) < y2));
	}

	projCollision(x2, y2, w2, h2){
		return Projectile.collides(this.x, this.y, this.radius, this.radius, x2, y2, w2, h2);
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
		let walls = this.level.getWalls();

		for(let i = 0; i < walls.length; i++){
			let wall = walls[i];
			let x = wall.getX();
			let y = wall.getY();
			let h = wall.getH();
			let w = wall.getW();

			if(this.projCollision(x, y, w, h))
				this.dead = true;
			// if(this.collides(x, y, w, h))
			// 	this.dead = true;
		}
	}

	checkEnemiesCollision(){
		let enemies = this.level.getEnemies();

		for(let i = 0; i < enemies.length; i++){
			let enemy = enemies[i];
			if(enemy == this.source) continue;
			let x = enemy.getX();
			let y = enemy.getY();
			let h = enemy.getH();
			let w = enemy.getW();

			if(this.projCollision(x, y, w, h))
				this.dead = true;

			// if(this.collides(x, y, w, h))
			// 	this.dead = true;
		}
	}

	checkDoorsCollision(){
		let doors = this.level.getDoors();

		for(let i = 0; i < doors.length; i++){
			let door = doors[i];
			if(door == this.source) continue;
			let x = door.getX();
			let y = door.getY();
			let h = door.getH();
			let w = door.getW();

			if(this.projCollision(x, y, w, h))
				this.dead = true;

			// if(this.collides(x, y, w, h))
			// 	this.dead = true;
		}
	}

	die(){
		this.dead = true;
	}

	isDead(){return this.dead;}
	getColor(){return this.color;}
	setColor(color){this.color = color;}
}