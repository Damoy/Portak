class Tile{
	constructor(id, ctx, canvas, world, map, row, col){
		this.id = id;
		this.ctx = ctx;
		this.canvas = canvas;
		this.map = map;
		this.row = row;
		this.world = world;
		this.col = col;
		this.x = this.col * MapContext.getTileSize();
		this.y = this.row * MapContext.getTileSize();
		this.color = null;
		this.occupier = null;
		this.power = null;
		this.enemy = null;
		this.texture = TextureContext.getGrayTileTexture();
	}

	update(){
		this.updatePower();
		this.updateEnemy();
	}

	updatePower(){
		if(this.isPoweredUp()){
			this.power.update();
		}
	}

	updateEnemy(){
		if(this.isAntagonised()){
			this.enemy.update();
		}
	}

	render(){
		this.ctx.save();
		this.texture.render(this.x, this.y);
		this.renderPower();
		this.renderEnemy();
		this.ctx.restore();
	}

	renderPower(){
		if(this.isPoweredUp()){
			this.power.render();
		}
	}

	renderEnemy(){
		if(this.isAntagonised()){
			this.enemy.render();
		}
	}

	occupyWith(occupier){
		if(this.occupier == null){
			this.occupier = occupier;
		}
		else {
			throw "Tile was already occupied !";
		}
	}

	antogonised(){
		if(this.isAntagonised()) return;
		this.enemy = new Enemy(this.ctx, this.canvas, this.world, this.x, this.y);
	}

	powerUp(powerLevel){ 
		if(this.isPoweredUp()) return;

		// for circle shape rendering
		// let tsd2 = MapContext.getTileSize() >> 1; // Size tile / 2
		// this.power = new Power(this.ctx, this.canvas, this.world, this.x + tsd2, this.y + tsd2, powerLevel);

		// for texture rendering
		this.power = new Power(this.ctx, this.canvas, this.world, this.x, this.y, powerLevel);
	}

	unpower() {
		this.power = null; 
	}

	getOccupier(){return this.occupier;}
	isOccupied(){return this.occupier != null;}

	colorize(color){this.color = color;}
	hide(){this.color = null;}

	getContext(){return this.ctx;}
	getCanvas(){return this.canvas;}
	getMap(){return this.map;}
	getRow(){return this.row;}
	getCol(){return this.col;}
	getX(){return this.x;}
	getY(){return this.y;}
	isPoweredUp(){return this.power != null;}
	isAntagonised(){return this.enemy != null;}
	getPower(){return this.power;}
	getId(){return this.id;}
}