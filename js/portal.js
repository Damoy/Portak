var PortalContext = {
	getPortalBaseWidth : function(){
		return MapContext.getTileSize() >> 1;
	},

	getPortalBaseHeight : function(){
		return MapContext.getTileSize() >> 1;
	}
};

class Portal extends Entity{
	constructor(ctx, canvas, world, sourceLevelId, destLevelId, srcX, srcY, destX, destY){
		super(ctx, canvas, world, srcX, srcY, PortalContext.getPortalBaseWidth(), PortalContext.getPortalBaseHeight(), "PaleTurquoise", 0, 0);
		println("Portal generation...");
		this.radius = this.computeRadius(this.value);

		// update portal only if ellipse
		this.rawRenderingXOffset = MapContext.getTileSize() >> 1;
		this.rawRenderingYOffset = MapContext.getTileSize() >> 1;
		this.addX(this.rawRenderingXOffset);
		this.addY(this.rawRenderingYOffset);
		this.updateBox();
		//this.texture = TextureContext.getPortalTexture();

		this.destX = destX;
		this.destY = destY;
		this.sourceLevelId = sourceLevelId;
		this.destLevelId = destLevelId;

		println("Portal: OK.");
	}

	update(){

	}

	interact(player){
		this.world.teleportPlayerWith(this, this.destLevelId, this.destX, this.destY);
	}

	render(){
		this.rawRender();
		// println(this.texture);
		// this.texture.render(this.x, this.y);
	}

	rawRender(){
		ctx.save();
		ctx.beginPath();
    	ctx.ellipse(this.x, this.y, this.radius, this.radius + (this.radius >> 1), 45 * Math.PI / 180, 0, 2 * Math.PI);
    	ctx.fillStyle = this.color;
    	ctx.fill();
    	ctx.stroke();
    	ctx.restore();
	}

	computeRadius(value){
		return((value % 5) << 1) + (MapContext.getTileSize() >> 2);
	}

	getDestX(){return this.destX;}
	getDestY(){return this.destY;}
	getSrcLevelId(){return this.sourceLevelId;}
	getDestLevelId(){return this.destLevelId;}
	getRawRenderingXOffset(){return this.rawRenderingXOffset;}
	getRawRenderingYOffset(){return this.rawRenderingYOffset;}
}