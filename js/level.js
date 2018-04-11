var LevelContext = {
	getBaseLayer : function(){return 1;},

	getMap : function(ctx, canvas, world){
		let rows = (RenderingContext.getCanvasHeight(canvas)) / MapContext.getTileSize();
		let cols = (RenderingContext.getCanvasWidth(canvas)) / MapContext.getTileSize();
		return new Map(ctx, canvas, world, rows, cols);
	}
};

/* -- Leveling -- */
class Level{
	constructor(id, ctx, canvas, world){
		println("Level generation...");
		this.id = id;
		this.ctx = ctx;
		this.canvas = canvas;
		this.world = world;
		this.layer = LevelContext.getBaseLayer();
		this.map = null;
		this.walls = [];
		this.portal = null;
		println("Level: OK.");
	}

	generate(){
		this.generateMap();
		this.generateWalls();
		this.generateEnemies();
		this.generateEnergies();
		//this.generatePortal();
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
				this.walls.push(newWall);
			}
		}
	}

	generateEnemies(){

	}

	generateEnergies(){
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

	generatePortal(){
		let mt = this.map.getTiles();
		for(let i = 0; i < mt.length; ++i){
			let rand = irand(1, 20);
			let tile = mt[i];
			if(!tile.isOccupied() && !tile.isPoweredUp()) {
				if(rand == 1){				
					this.portal = new Portal(this.ctx, this.canvas, this.world, this, tile.getX(), tile.getY());
					break;
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
		this.renderPortal();
	}

	renderMap(){
		this.map.render();
	}

	renderPopulation(){
		this.walls.forEach((wall) => {
			wall.render();
		})
	};

	renderPortal(){
		if(this.portal != null)
			this.portal.render();
	}

	setPortal(portal){
		this.portal = portal;
	}

	evolve(){
	}

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
	getLayer(){return this.layer;}
	getPortal(){return this.portal;}
	getId(){return this.id;}
}