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
		this.enemies = [];
		this.powers = [];
		this.powerAmount = powerAmount;
		println("Level: OK.");
	}

	generate(){
		this.generateMap();
		this.generateWalls();
		this.generatePowers();
		this.generateEnemies();
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
				let enemy = new Enemy(this.ctx, this.canvas, this.world, tile.getX(), tile.getY());
				//this.map.occupyTileWith(enemy);
				this.map.antogoniseTileWith(enemy);
				this.enemies.push(enemy);
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
					let power = new Power(this.ctx, this.canvas, this.world, tile.getX(), tile.getY(), irand(1, 2));
					//this.map.occupyTileWith(power);
					this.map.powerUpTileWith(power);
					this.powers.push(power);			
				}
			}
		}
	}


	removeEnemy(enemy) {
		removeFromArray(this.enemies, enemy);
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

		this.enemies.forEach((enemy) => {
			enemy.update();
		});

		this.powers.forEach((power) => {
			power.update();
		});
	}

	render(){
		this.renderMap();
		this.renderPopulation();
	}

	renderMap(){
		this.map.render();
	}

	reset(){
		this.walls = [];
		this.enemies = [];
		this.powers = [];
		this.map.reset();
		this.generateWalls();
		this.generatePowers();
		this.generateEnemies();
	}

	renderPopulation(){
		this.walls.forEach((wall) => {
			wall.render();
		})

		this.enemies.forEach((enemy) => {
			enemy.render();
		});

		this.powers.forEach((power) => {
			power.render();
		});
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
	getEnemies(){return this.enemies;}
	getWalls(){return this.walls;}
}