var grayTileTexture = null;
var powerTexture = null;
var grayWallTexture = null;
var portalTexture = null;

var TextureContext = {
	init(ctx, canvas){
		let s = MapContext.getTileSize();
		grayTileTexture = new Texture(ctx, canvas, "res/textures/grayTile.png", s, s);
		powerTexture = new Texture(ctx, canvas, "res/textures/power.png", s, s).scale(0.5, 0.5);
		grayWallTexture = new Texture(ctx, canvas, "res/textures/wall.png", s, s);
		portalTexture = new Texture(ctx, canvas, "res/textures/power2.png", s, s); // .scale(0.5, 0.5);
	},

	getGrayTileTexture : function(){
		return grayTileTexture;
	},

	getPowerTexture : function(){
		return powerTexture;
	},

	getGrayWallTexture : function(){
		return grayWallTexture;
	},

	getPortalTexture : function(){
		return portalTexture;
	}
};

class Texture{
	constructor(ctx, canvas, path, width, height){
		this.ctx = ctx;
		this.canvas = canvas;
		this.path = path;
		this.width = width;
		this.height = height;
		this.data = new Image();
		this.data.src = this.path;
		this.xOffset = 0;
		this.yOffset = 0;
	}

	render(x, y){
		this.ctx.drawImage(this.data, x + this.xOffset, y + this.yOffset, this.width, this.height);
	}

	sizedRender(x, y, w, h){
		this.ctx.drawImage(this.data, x, y, w, h);
	}

	// https://www.w3schools.com/tags/canvas_drawimage.asp
	clippedRender(startX, startY, startWidth, startHeight, x, y, w, h){
		this.ctx.drawImage(this.data, startX, startY, startWidth, startHeight, x, y, w, h);
	}

	// scales the texture and center it in the tile
	scale(scaleX, scaleY){
		let wDiff = 0;
		let hDiff = 0;

		if(scaleX != 0 && scaleX != 1){
			let wSave = this.width;
			this.width *= scaleX;
			wDiff = (Math.abs(wSave - this.width)) >> 1;
		}

		if(scaleY != 0 && scaleY != 1){
			let hSave = this.height;
			this.height *= scaleY;
			hDiff = (Math.abs(hSave - this.height)) >> 1;
		}

		this.xOffset = wDiff;
		this.yOffset = hDiff;

		return this;
	}

	getContext(){return this.ctx;}
	getCanvas(){return this.canvas;}
	getPath(){return this.path;}
	getWidth(){return this.width;}
	getHeight(){return this.height;}
}