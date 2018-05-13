// Type of wall the player can destroy
class DestructibleWall extends Entity{
	constructor(ctx, canvas, world, x, y){
        super(ctx, canvas, world, x, y, MapContext.getTileSize(), MapContext.getTileSize(), 0, 0);
        this.texture = TextureContext.getDestructibleWallTexture();
	}

	render(){
		this.textureRender();
	}

	textureRender(){
		this.texture.render(this.x, this.y);
    }
    
    getTile(){return this.tile;}
}