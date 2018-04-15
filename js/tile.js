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
	}

	render(){
		this.ctx.save();
		this.texture.render(this.x, this.y);
		this.ctx.restore();
	}

	occupyWith(occupier){
		if(this.occupier == null){
			this.occupier = occupier;
		}
		else {
			throw "Tile was already occupied !";
		}
	}

	antagoniseWith(enemy){
		if(this.enemy == null){
			this.enemy = enemy;
		}
		else {
			throw "Tile was already antogonised !";
		}
	}

	powerUpWith(power){
		if(this.power == null){
			this.power = power;
		}
		else {
			throw "Tile was already powered up !";
		}
	}

    unpower() {
        this.map.removePower(this.power);
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