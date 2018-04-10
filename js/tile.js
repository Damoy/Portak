var TileContext = {
};

class Tile{
	constructor(ctx, canvas, world, map, row, col){
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
	}

	update(){
	//	this.checkMouseHovering();
		this.updatePower();
	}

	updatePower(){
		if(this.isPoweredUp()){
			this.power.update();
		}
	}

	checkMouseHovering(){
		let mp = EventContext.getMousePos();
		if(mp == null){
			println("Mouse pos null.");
			return;
		}

		let mrow = MapContext.getTileRow(mp.y); // | 0 -- to int
		let mcol = MapContext.getTileCol(mp.x);

		if(mrow == this.row && mcol == this.col){
			this.colorize("blue");
		} else {
			this.hide();
		}

	}

	render(){
		this.renderMouseHovering();
		this.renderPower();
	}

	renderPower(){
		if(this.isPoweredUp()){
			this.power.render();
		}
	}

	renderMouseHovering(){
		if(this.color != null){
			ctx.save();
			ctx.fillStyle = this.color;
			ctx.fillRect(MapContext.getNormX(this.col), MapContext.getNormY(this.row), MapContext.getTileSize(), MapContext.getTileSize());
			ctx.restore();
		}
	}

	occupyWith(occupier){
		if(this.occupier == null){
			this.occupier = occupier;
		} else {
			throw "Tile was already occupied !";
		}
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
	getPower(){return this.power;}

	powerUp(){ 
		if(this.isPoweredUp()) return;
		let tsd2 = MapContext.getTileSize() >> 1; // Size tile / 2
		this.power = new Energy(this.ctx, this.canvas, this.world, this.x + tsd2, this.y + tsd2, 1);
	}

	unpower() {
		this.power = null; 
	}
}