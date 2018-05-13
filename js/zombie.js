class Zombie extends Enemy{
	constructor(ctx, canvas, world, x, y, direction){
		super(ctx, canvas, world, x, y, direction, TextureContext.getZombieTexture());
	}

    render(){
        let xStart;
        let yStart = 0;
        let width = MapContext.getTileSize();
        let height = MapContext.getTileSize();

        switch(this.direction){
            case AnimationContext.getDownDirValue():
                xStart = 0;
                break;
            case AnimationContext.getLeftDirValue():
                xStart = width * 3;
                break;
            case AnimationContext.getRightDirValue():
                xStart = width << 1;
                break;
            case AnimationContext.getUpDirValue():
                xStart = width;
                break;
            default:
                xStart = 0;
                break;
        }

        this.texture.clippedRender(xStart, yStart, width, height, this.x, this.y, width, height);
        this.renderProjectiles();
    }
}