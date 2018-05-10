class EnemyProjectile extends Projectile{
	constructor(ctx, canvas, world, x, y, direction, source){
		super(ctx, canvas, world, x, y, 20, 10, direction, "FireBrick", source);
		this.player = this.world.getPlayer();
	}

	update(){
		if(!this.dead){
			super.update();
			this.checkPlayerCollision();
			this.checkDestructiblesWallsCollision();
		}
	}

	checkPlayerCollision(){
		// let p = this.player;
		// if(this.collides(p.getX(), p.getY(), p.getW(), p.getH())) {
		// 	println("Enemy projectile collided player.");
		// 	this.dead = true;
		// 	this.world.resetCurrentLevel();
		// 	SoundContext.getDeathSound().play();
		// }
		if(this.player.accurateProjCollision(this.x, this.y, this.radius)){
			println("Enemy projectile collided player.");
			this.dead = true;
			this.world.resetCurrentLevel();
		}
	}

	checkDestructiblesWallsCollision(){
		let destructiblesWalls = this.level.getDestructiblesWalls();
		for(let i = 0; i < destructiblesWalls.length; i++){
			let dw = destructiblesWalls[i];
			let x = dw.getX();
			let y = dw.getY();
			let h = dw.getH();
			let w = dw.getW();
			if(this.collides(x,y,w,h)){
				this.dead = true;
				return;
			}
		}
	}

}


