var LevelContext = {
	getMap : function(ctx, canvas, world){
		let rows = (RenderingContext.getCanvasHeight(canvas)) / MapContext.getTileSize();
		let cols = (RenderingContext.getCanvasWidth(canvas)) / MapContext.getTileSize();
		return new Map(ctx, canvas, world, rows, cols);
	}
};

/* -- Leveling -- */
class Level{
	constructor(id, ctx, canvas, world, powerAmount){
		println("Level generation...");
		this.id = id;
		this.ctx = ctx;
		this.canvas = canvas;
		this.world = world;
		this.map = null;
		this.walls = [];
		this.powerAmount = powerAmount;
		println("Level: OK.");
	}

	generate(){
		this.generateMap();
		this.generateWalls();
		this.generateEnemies();
		this.generatePowers();
	}

	generateMap(){
		this.map = LevelContext.getMap(this.ctx, this.canvas, this.world);
	}

	generateWalls(){
		let mt = this.map.getTiles();

		for(let i = 0; i < mt.length; ++i){
			let rand = irand(1, 5);
			let tile = mt[i];

			if(rand == 1){
				let newWall = new Wall(this.ctx, this.canvas, this.world, tile.getX(), tile.getY(), "DimGray");
				this.map.occupyTileWith(newWall);
				this.walls.push(newWall);
			}
		}
	}

	generateEnemies(){
		let mt = this.map.getTiles();
		for(let i = 0; i < mt.length; ++i){
			let rand = irand(1, 30);
			let tile = mt[i];
			if(!tile.isOccupied() && !tile.isPoweredUp()) {
			if(rand == 1){
				tile.antogonised();
				}
			}
		}
	}
	
	generatePowers(){
		let mt = this.map.getTiles();
		for(let i = 0; i < mt.length; ++i){
			let rand = irand(1, 20);
			let tile = mt[i];
			if(!tile.isOccupied()) {
				if(rand == 1){				
					tile.powerUp(irand(1, 2));
				}
			}
		}
	}

	update(){
		this.updateMap();
		this.updatePopulation();
	}

	updateMap(){
		this.map.update();
	}

	updatePopulation(){
		this.walls.forEach((wall) => {
			wall.update();
		});
	}

	render(){
		this.renderMap();
		this.renderPopulation();
	}

	renderMap(){
		this.map.render();
	}

	renderPopulation(){
		this.walls.forEach((wall) => {
			wall.render();
		})
	};

	collision(x, y, w, h){
		for(let i = 0; i < this.walls.length; ++i){
			if(this.walls[i].collides(x, y, w, h)){
				return true;
			}
		}

		return false;
	}

	getMap(){return this.map;}
	getWorld(){return this.world;}
	getContext(){return this.ctx;}
	getCanvas(){return this.canvas;}
	getId(){return this.id;}
	getPowerAmount(){return this.powerAmount;}
}