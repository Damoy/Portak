var PortalContext = {
	getPortalBaseWidth : function(){
		return MapContext.getTileSize() >> 1;
	},

	getPortalBaseHeight : function(){
		return MapContext.getTileSize() >> 1;
	}
};

class Portal extends Entity{
	constructor(id, ctx, canvas, world, x, y){
		super(ctx, canvas, world, x, y, PortalContext.getPortalBaseWidth(), PortalContext.getPortalBaseHeight(), "PaleTurquoise", 0, 0);
		println("Portal generation...");
		this.updateBox();

		this.id = id;

		let NULL = AnimationContext.getNullValue();
		this.animation = new Animation(this.ctx, this.canvas, "res/textures/portal/portal64.png",
		256, 64, 0, 64, 64, NULL, 4, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
		this.animation.start();
		this.animationTickCounter = new TickCounter(32);

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
		SoundContext.getPortalSound().play();
		this.world.upgradeLevel();
		this.world.destroyPortal(this);
	}

	render(){
		this.animation.render(this.x, this.y);
	}

	getId(){
		return this.id;
	}

	getX(){
		return this.x;
	}

	getY(){
		return this.y;
	}
}