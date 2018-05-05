class Key extends Entity{
	constructor(ctx, canvas, world, x, y, id){
		super(ctx, canvas, world, x, y, MapContext.getTileSize() >> 1, MapContext.getTileSize() >> 1, "LightGreen", 0, 0);
		this.id = id;
		this.texture = TextureContext.getKeyTexture();
	}

	update(){
	}

	interact(player){
		player.addPower(this.value);
	}

	render(){
		this.texture.render(this.x, this.y);
	}

    getTile(){return this.tile;}
	getId(){return this.id;}
}