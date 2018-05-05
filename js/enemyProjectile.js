class EnemyProjectile extends Projectile{
	constructor(ctx, canvas, world, x, y, direction, source){
		super(ctx, canvas, world, x, y, 20, 10, direction, "FireBrick", source);
		this.player = this.world.getPlayer();
	}

	update(){
		if(!this.dead){
			super.update();
			this.checkPlayerCollision();
		}
	}

	checkPlayerCollision(){
		let p = this.player;
		if(this.collides(p.getX(), p.getY(), p.getW(), p.getH())) {
			println("Enemy projectile collided player.");
			this.dead = true;
			this.world.resetCurrentLevel();
		}
	}

}


