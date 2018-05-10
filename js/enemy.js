var EnemyContext = {
};

class Enemy extends Entity{
	constructor(ctx, canvas, world, x, y, direction, texture){
		super(ctx, canvas, world, x, y, MapContext.getTileSize(), MapContext.getTileSize(), 0, 0);
		this.life = 1;
		this.projectiles = [];
		this.deadProjectiles = [];

		this.shootCounter = null;
		this.direction = direction;
		this.texture = texture;
	}

	update(){
		if(!this.isDead()) {
			this.updateShootCounter();
			this.updateProjectiles();
			this.updateBox();
		}
	}

	updateShootCounter(){
		if(this.shootCounter == null){
			this.shoot();
			this.shootCounter = new TickCounter(60);
			return;
		}

		if(this.shootCounter != null)
			this.shootCounter.update();

		if(this.shootCounter.isStopped()){
			this.shootCounter.reset();
			this.shoot();
		}
	}

	render(){
		this.textureRender();
		this.renderProjectiles();
	}

	textureRender(){
		this.texture.render(this.x, this.y);
	}

	renderRect(){
		ctx.save();
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x, this.y, this.w, this.h);
		ctx.restore();
	}

	shoot(){
		let projectile = new EnemyProjectile(this.ctx, this.canvas, this.world, this.x + (this.w >> 1), this.y + (this.h >> 1), this.direction, this);
		this.projectiles.push(projectile);
	}

	updateProjectiles(){
		this.projectiles.forEach((proj) => {
			proj.update();
		});
		this.checkProjectilesState();
	}

	checkProjectilesState(){
		for(let i = 0; i < this.projectiles.length; i++) {
			let proj = this.projectiles[i];
			if(proj.isDead()){
				this.deadProjectiles.push(proj);
			}
		}

		for(let i = 0; i < this.deadProjectiles.length; i++) {
			this.removeProjectile(this.deadProjectiles[i]);
		}
	}

	removeProjectile(projectile){
		removeFromArray(this.projectiles, projectile);
	}

	addToDeadProjectiles(projectile) {
		this.deadProjectiles.push(projectile);
	}

	renderProjectiles(){
		this.projectiles.forEach((proj) => {
			proj.render();
		});
	}

	getLife(){return this.life;}
	getStrength(){return this.strength;}
	subLife(value){this.life -= value;}
	isDead(){return (this.life <= 0);}

}