class PlayerProjectile extends Projectile{
	constructor(ctx, canvas, world, x, y, direction, enemies){
		super(ctx, canvas, world, x, y, 20, 10, direction,"LightSlateGray");
		this.enemies = enemies;
	}

	update(){
		if(!this.dead){
			super.update();
			this.checkEnemiesCollision();
		}
	}

	checkEnemiesCollision(){
		for(let i = 0; i < this.enemies.length; i++){
			let e = this.enemies[i];
			let x = e.getX();
			let y = e.getY();
			let h = e.getH();
			let w = e.getW();
			if(this.collides(x,y,w,h)){
				this.dead = true;
				this.level.removeEnemy(e);
				this.level.getMap().getNormTileAt(x,y).forgetEnemy();
				return;
			}
		}
	}

}


