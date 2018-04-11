class Wall extends Entity{
	constructor(ctx, canvas, world, x, y, color){
		super(ctx, canvas, world, x, y, MapContext.getTileSize(), MapContext.getTileSize(), color, 0, 0);
		this.tile = this.map.occupyTileWith(this);
	}

	update(){

	}

	render(){
		ctx.save();
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x, this.y, this.w - 1, this.h - 1);

		ctx.fillStyle = "gray";
		ctx.fillRect(this.x + 3, this.y - 1 , this.w - 2 , this.h - 2);
		// ctx.fillStyle = "gray";
		// ctx.fillRect(this.x + 1, this.y + 1, this.w - 1, this.h - 1);
		ctx.restore();
	}

	getTile(){return this.tile;}
}