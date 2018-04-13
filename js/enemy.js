//TODO : 
//--- Tirs dans une direction tant que enemy !isDead()
//--- Tirs qui blessent joueur

class Enemy extends Entity{
	constructor(ctx, canvas, world, x, y, strength){
		super(ctx, canvas, world, x, y, MapContext.getTileSize(), MapContext.getTileSize(), "FireBrick", 0, 0);
		println("Enemy generation...");

		this.life = 1;
		this.strength = strength;

		this.projectiles = [];
		this.deadProjectiles = [];

		this.shootCounter = null;

		this.direction = null;

		this.texture = TextureContext.getEnemyTexture();

		println("Enemy: OK.");
	}

	render(){
		this.textureRender();
		//this.renderRect();
		this.renderProjectiles();
	}

	update(){
		if(!this.isDead()) {
			this.tick();
			this.updateProjectiles();
		}
	}

	tick(){
		if(this.shootCounter != null)
			this.shootCounter.tick();
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