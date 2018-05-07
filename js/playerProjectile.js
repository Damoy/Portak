class PlayerProjectile extends Projectile{
	constructor(ctx, canvas, world, x, y, direction, enemies,destructiblesWalls){
		super(ctx, canvas, world, x, y, 20, 10, direction,"LightSlateGray");
	}

	update(){
		if(!this.dead){
			super.update();
			this.checkEnemiesCollision();
			this.checkDestructiblesWallsCollision();
		}
	}

	checkEnemiesCollision(){
		let enemies = this.level.getEnemies();
		for(let i = 0; i < enemies.length; i++){
			let e = enemies[i];
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
				this.level.removeDestructibleWall(dw);
				this.level.getMap().getNormTileAt(x,y).forgetDestructibleWall();
				return;
			}
		}
	}
}


