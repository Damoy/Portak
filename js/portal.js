var PortalContext = {
	getPortalBaseWidth : function(){
		return MapContext.getTileSize() >> 1;
	},

	getPortalBaseHeight : function(){
		return MapContext.getTileSize() >> 1;
	}
};

class Portal extends Entity{
	constructor(ctx, canvas, world, level, x, y){
		super(ctx, canvas, world, x, y, PortalContext.getPortalBaseWidth(), PortalContext.getPortalBaseHeight(), "PaleTurquoise", 0, 0);
		println("Portal generation...");
		this.radius = this.computeRadius(this.value);
		this.sourceLevel = level; // overriding the level
		this.destLevel = null;
		this.destLevelX = 0;
		this.destLevelY = 0;
		this.x += (MapContext.getTileSize() >> 1);
		this.y += (MapContext.getTileSize() >> 1);
		println("portal x: " + this.x + ", y: " + this.y);
		println("Portal: OK.");
	}

	update(){

	}

	linkTo(destLevel, destX, destY){
		if(this.destLevel != null)
			throw "Could not link portal.";

		this.destLevel = destLevel;
		this.destLevelX = destX;
		this.destLevelY = destY;
	}

	interact(player){
		if(this.destLevel == null)
			throw "Could not interact with portal.";

		this.world.teleportPlayer(this.destLevel, this.destLevelX, this.destLevelY);
	}

	render(){
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

}