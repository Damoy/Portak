class Portal extends Entity{
	constructor(ctx, canvas, world, x, y, value){
		super(ctx, canvas, world, x, y, MapContext.getTileSize() >> 1, MapContext.getTileSize() >> 1, "PaleTurquoise", 0, 0);
		println("Portal generation...");
		this.value = value;
		this.used = false;
		this.radius = this.computeRadius(this.value);
		println("Portal: OK.");
	}

	update(){
		if(this.used) return;
		// if(player.collidex(this)) interact(player)
	}

	interact(player){
		if(this.used) return;
		used = true;
	}

	render(){
		ctx.save();
		ctx.beginPath();
    	ctx.ellipse(this.x, this.y, this.radius, this.radius + (this.radius >> 1), 45 * Math.PI/180, 0, 2 * Math.PI);
    	ctx.fillStyle = this.color;
    	ctx.fill();
    	ctx.stroke();

    	/*ctx.beginPath();
    	ctx.ellipse(this.x, this.y, this.radius >> 1, (this.radius + (this.radius >> 1)) >> 1, 45 * Math.PI/180, 0, 2 * Math.PI);
    	ctx.fillStyle = "LightSlateGray" ;
    	ctx.fill();
    	ctx.stroke(); */
    	ctx.restore();
	}

	computeRadius(value){
		return((value % 5) << 1) + (MapContext.getTileSize() >> 2);
	}

}