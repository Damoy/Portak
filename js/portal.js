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
		this.updateBox();

		let NULL = AnimationContext.getNullValue();
		this.animation = new Animation(this.ctx, this.canvas, "res/textures/portal/portal64.png",
		256, 64, 0, 64, 64, NULL, 4, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
		this.animation.start();
		this.animationTickCounter = new TickCounter(32);

		this.destX = destX;
		this.destY = destY;
		this.sourceLevelId = sourceLevelId;
		this.destLevelId = destLevelId;

		println("Portal: OK.");
	}

	update(){
		if(this.animationTickCounter.isStopped()){
			this.animation.tick();
			this.animationTickCounter.reset();
		} else {
			this.animationTickCounter.tick();
		}
	}

	interact(player){
		this.world.teleportPlayerWith(this, this.destLevelId, this.destX, this.destY);
	}

	render(){
		this.animation.render(this.x, this.y);
	}

	getDestX(){return this.destX;}
	getDestY(){return this.destY;}
	getSrcLevelId(){return this.sourceLevelId;}
	getDestLevelId(){return this.destLevelId;}
}