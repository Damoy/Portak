// A door can be opened by only one key
class Door extends Entity{
	constructor(ctx, canvas, world, x, y, id){
        super(ctx, canvas, world, x, y, MapContext.getTileSize(), MapContext.getTileSize(), 0, 0);
        this.id = id;
        this.texture = TextureContext.getDoorTexture();
	}

	update(){
	}

	render(){
		this.textureRender();
	}

	textureRender(){
		this.texture.render(this.x, this.y);
	}

    getTile(){return this.tile;}
	getId(){return this.id;}
	
}