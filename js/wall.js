class Wall extends Entity{
	constructor(ctx, canvas, world, x, y, color){
		super(ctx, canvas, world, x, y, MapContext.getTileSize(), MapContext.getTileSize(), color, 0, 0);
		this.texture = TextureContext.getGrayWallTexture();
	}

	update(){

	}

	render(){
		// this.rawRender();
		this.textureRender();
	}

	rawRender(){
		this.ctx.save();
		this.ctx.fillStyle = this.color;
		this.ctx.fillRect(this.x, this.y, this.w, this.h);

		this.ctx.fillStyle = "gray";
		this.ctx.fillRect(this.x + 3, this.y - 1 , this.w - 2 , this.h - 2);
		this.ctx.restore();
	}

	textureRender(){
		this.texture.render(this.x, this.y);
	}

	getTile(){return this.tile;}
}