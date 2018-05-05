var LevelContext = {
	generateMap : function(ctx, canvas, world){
		let rows = (RenderingContext.getCanvasHeight(canvas)) / MapContext.getTileSize();
		let cols = (RenderingContext.getCanvasWidth(canvas)) / MapContext.getTileSize();
		return new Map(ctx, canvas, world, rows, cols);
	}
};

/* -- Leveling -- */
class Level{
	constructor(id, source, ctx, canvas, world, map, walls, enemies, powers, powerAmount, playerInitX, playerInitY, playerInitPower, doors, keys){
		println("Level generation...");
		this.id = id;
		this.source = source;
		this.ctx = ctx;
		this.canvas = canvas;
		this.world = world;

		// assumes that one null parameter is using the empty constructor
		if(map != null && walls != null && enemies != null && powers != null && doors != null && keys != null){
			this.map = map;
			this.setWalls(walls);
			this.setEnemies(enemies);
			this.setPowers(powers);
			this.setDoors(doors);
			this.setKeys(keys);
			this.savedWalls = this.walls;
			this.savedEnemies = this.enemies;
			this.savedPowers = this.powers;
		} else {
			this.map = null;
			this.walls = [];
			this.enemies = [];
			this.powers = [];
			this.doors = [];
			this.keys = [];
			this.savedWalls = [];
			this.savedEnemies = [];
			this.savedPowers = [];
			this.savedDoors = [];
			this.savedKeys = [];

		}
		
		this.powerAmount = powerAmount || 0;
		this.playerInitX = playerInitX;
		this.playerInitY = playerInitY;
		this.playerInitPower = playerInitPower;
		println("Level: OK.");
	}

	setWalls(walls){
		if(this.map == null)
			throw "Map should be set before walls.";

		this.walls = walls;

		this.walls.forEach((wall) => {
			this.map.occupyTileWith(wall);
		});

		this.savedWalls = walls;
	}

	setDoors(doors){
		if(this.map == null)
			throw "Map should be set before doors.";

		this.doors = doors;

		this.doors.forEach((door) => {
			this.map.closeTileWith(door);
		});

		this.savedDoors = doors;
	}

	setKeys(keys){
		if(this.map == null)
			throw "Map should be set before keys.";

		this.keys = keys;

		this.keys.forEach((key) => {
			this.map.openUpTileWith(key);
		});

		this.savedKeys = keys;
	}

	setEnemies(enemies){
		if(this.map == null)
			throw "Map should be set before enemies.";

		this.enemies = enemies;
		this.enemies.forEach((enemy) => {
			this.map.antogoniseTileWith(enemy);
		});

		this.savedEnemies = enemies;
	}

	setPowers(powers){
		if(this.map == null)
			throw "Map should be set before powers.";

		this.powers = powers;
		this.powers.forEach((power) => {
			this.map.powerUpTileWith(power);
		});

		this.savedPowers = powers;
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

		this.doors.forEach((door) => {
			door.update();
		});

		this.keys.forEach((key) => {
			key.update();
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
		println("Resetting level...");
		this.map.reset();
		this.setWalls(this.savedWalls);
		this.setEnemies(this.savedEnemies);
		this.setPowers(this.savedPowers);
	}

	renderPopulation(){
		this.powers.forEach((power) => {
			power.render();
		});

		this.walls.forEach((wall) => {
			wall.render();
		})

		this.enemies.forEach((enemy) => {
			enemy.render();
		});

		this.doors.forEach((door) => {
			door.render();
		});

		this.keys.forEach((key) => {
			key.render();
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
	getSource(){return this.source;}
	getPlayerInitX(){return this.playerInitX;}
	getPlayerInitY(){return this.playerInitY;}
	getPlayerInitPower(){return this.playerInitPower;}

}