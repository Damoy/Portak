var MapContext = {
	getTileSize : function(){return 64;},
	getNormX : function(col){return MapContext.getTileSize() * col;},
	getNormY : function(row){return MapContext.getTileSize() * row;},
	getTileRow : function(y){return y / MapContext.getTileSize();},
	getTileCol : function(x){return x / MapContext.getTileSize();}
};

class Map{
	constructor(ctx, canvas, world, rows, cols){
		println("Map generation...");
		this.ctx = ctx;
		this.canvas = canvas;
		this.world = world;
		this.rows = rows;
		this.cols = cols;
		this.tiles = [];
		this.build();
		println("Map: OK.");
	}

	update(){
		this.tiles.forEach((tile) => {
			tile.update();
		});
	}

	render(){
		this.tiles.forEach((tile) => {
			tile.render();
		});
	}

	build(){
		// too many objects, could create some objects then create an int array
		// and use / render according to the mapping int data <-> Tile object
		for(let row = 0; row < this.rows; ++row){
			for(let col = 0; col < this.cols; ++col){
				this.tiles[this.nget(row, col)] = new Tile(this.ctx, this.canvas, this.world, this, row, col);
			}
		}
	}

	occupyTileWith(occupier){
		let tdest = this.getTileAt(occupier.getRow(), occupier.getCol());
		if(tdest != null)
			tdest.occupyWith(occupier);
		else
			throw "WTF";
	}

	nget(row, col){
		return this.rows * col + row; // return this.cols * row + col; // this.rows * col + row;
	}

	getTileAt(row, col){
		return this.tiles[this.nget(row, col)];
	}

	// have to take in count offsets, if need at a point
	getNormTileAt(x, y){
		return this.getTileAt(y / MapContext.getTileSize(), x / MapContext.getTileSize());
	}

	getTiles(){return this.tiles;}
	getNumRows(){return this.rows;}
	getNumCols(){return this.cols;}

}