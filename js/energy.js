class Energy extends Entity{
	constructor(ctx, canvas, world, x, y, value){
		super(ctx, canvas, world, x, y, MapContext.getTileSize() >> 1, MapContext.getTileSize() >> 1, "LightGreen", 0, 0);
		println("Energy generation...");
		this.value = value;
		this.radius = this.computeRadius(this.value);
		println("Energy: OK.");
	}

	update(){
	}

	interact(player){
		player.addEnergy(this.value);
	}

	render(){
		ctx.save();
		ctx.beginPath();
    	ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    	ctx.fillStyle = this.color;
    	ctx.fill();
    	ctx.stroke();
    	ctx.restore();
	}

	computeRadius(value){
		return((value % 5) << 1) + (MapContext.getTileSize() >> 2);
	}

	getValue(){return this.value;}
}