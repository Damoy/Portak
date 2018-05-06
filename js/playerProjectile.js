class PlayerProjectile extends Projectile{
	constructor(ctx, canvas, world, x, y, direction, enemies,destructiblesWalls){
		super(ctx, canvas, world, x, y, 20, 10, direction,"LightSlateGray");
		this.enemies = enemies;
		this.destructiblesWalls = destructiblesWalls;
	}

	update(){
		if(!this.dead){
			super.update();
			this.checkEnemiesCollision();
			this.checkDestructiblesWallsCollision();
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

	checkDestructiblesWallsCollision(){
		for(let i = 0; i < this.destructiblesWalls.length; i++){
			let dw = this.destructiblesWalls[i];
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


