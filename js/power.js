class Power extends Entity{
	constructor(ctx, canvas, world, x, y, value){
		super(ctx, canvas, world, x, y, MapContext.getTileSize() >> 1, MapContext.getTileSize() >> 1, "LightGreen", 0, 0);
		println("Power generation...");
		this.value = value;
		this.radius = computeRadius(this.value, MapContext.getTileSize());
		this.texture = TextureContext.getPowerTexture();
		println("Power: OK.");
	}

	update(){
	}

	interact(player){
		player.addPower(this.value);
	}

	render(){
		this.ctx.save();
		this.texture.render(this.x, this.y);
		this.ctx.restore();
		// ctx.save();
		// ctx.beginPath();
  //   	ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
  //   	ctx.fillStyle = this.color;
  //   	ctx.fill();
  //   	ctx.stroke();
  //   	ctx.restore();
	}

	getValue(){return this.value;}
}