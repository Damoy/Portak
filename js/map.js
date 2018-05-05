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
		
		// simulating multiple constructors...
		if(arguments.length == 3){
			// println("Empty map detected.");
			return;
		}

		if(arguments.length == 4){
			// println("Loaded map detected.");
			this.tiles = rows;
			return;	
		}
		
		this.rows = rows;
		this.cols = cols;
		this.tiles = [];
		this.build();
		
		println("Map: OK.");
	}

	reset(){
		for(let i = 0; i < this.tiles.length; ++i)
			this.tiles[i].reset();
		}

	update(){
		this.tiles.forEach((tile) => {
			tile.update();
			if(tile.key != tile.savedKey) {
				this.tiles.forEach((otherTile) => {
					if(otherTile.door != null) {
						if(tile.savedKey.getId() == 10 && otherTile.door.getId() == 9){
							otherTile.unclose();
						}
					}
				});
			}
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
		let id = 0;
		for(let row = 0; row < this.rows; ++row){
			for(let col = 0; col < this.cols; ++col){
				this.tiles[this.nget(row, col)] = new Tile(id++, this.ctx, this.canvas, this.world, this, row, col);
			}
		}

		println(AStar(this, this.tiles[0], this.tiles[this.tiles.length - 1]));
	}

	occupyTileWith(occupier){
		let tdest = this.getTileAt(occupier.getRow(), occupier.getCol());
		if(tdest != null)
			tdest.occupyWith(occupier);
	}

	closeTileWith(door){
		let tdest = this.getTileAt(door.getRow(), door.getCol());
		if(tdest != null)
			tdest.closeWith(door);
	}

	openUpTileWith(key){
		let tdest = this.getTileAt(key.getRow(), key.getCol());
		if(tdest != null)
			tdest.openUpWith(key);

	}

	antogoniseTileWith(enemy){
		let tdest = this.getTileAt(enemy.getRow(), enemy.getCol());
		if(tdest != null)
			tdest.antagoniseWith(enemy);
	} 

	powerUpTileWith(power){
		let tdest = this.getTileAt(power.getRow(), power.getCol());
		if(tdest != null)
			tdest.powerUpWith(power);
	}

	removePower(power){
        if(this.level == null)
            this.level = this.world.getCurrentLevel();

        removeFromArray(this.level.powers, power);
	}
	
	removeKey(key){
        if(this.level == null)
            this.level = this.world.getCurrentLevel();

        removeFromArray(this.level.keys, key);
	}
	
		
	removeDoor(door){
        if(this.level == null)
            this.level = this.world.getCurrentLevel();

        removeFromArray(this.level.doors, door);
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

	getContext(){return this.ctx};
	getCanvas(){return this.canvas;}
	getWorld(){return this.world;}
	getTiles(){return this.tiles;}
	getNumRows(){return this.rows;}
	getNumCols(){return this.cols;}

}