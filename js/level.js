var LevelContext = {
	generateMap : function(ctx, canvas, world){
		let rows = (RenderingContext.getCanvasHeight(canvas)) / MapContext.getTileSize();
		let cols = (RenderingContext.getCanvasWidth(canvas)) / MapContext.getTileSize();
		return new Map(ctx, canvas, world, rows, cols);
	}
};

/* -- Leveling -- */
class Level{
	constructor(id, levelName, source, ctx, canvas, world, map, walls, enemies, powers, powerAmount, playerInitX, playerInitY, playerInitPower, doors, keys, destructiblesWalls){
		println("Level generation...");
		this.id = id;
		this.levelName = levelName;
		this.source = source;
		this.ctx = ctx;
		this.canvas = canvas;
		this.world = world;

		// assumes that one null parameter is using the empty constructor
		if(map != null && walls != null && enemies != null && powers != null && doors != null && keys != null && destructiblesWalls != null){
			this.map = map;
			this.setWalls(walls);
			this.setEnemies(enemies);
			this.setPowers(powers);
			this.setDoors(doors);
			this.setKeys(keys);
			this.setDestructiblesWalls(destructiblesWalls);
		} else {
			this.map = null;
			this.walls = [];
			this.enemies = [];
			this.powers = [];
			this.doors = [];
			this.keys = [];
			this.destructiblesWalls = [];
		}
		
		this.powerAmount = powerAmount || 0;
		this.playerInitX = playerInitX;
		this.playerInitY = playerInitY;
		this.playerInitPower = playerInitPower;

		this.startInfosTimer = null;
		println("Level: OK.");
	}

	setWalls(walls){
		if(this.map == null)
			throw "Map should be set before walls.";

		this.walls = walls;

		this.walls.forEach((wall) => {
			this.map.occupyTileWith(wall);
		});
	}

	start(){
		if(this.startInfosTimer == null)
			this.startInfosTimer = new TickCounter(180);
	}

	setDoors(doors){
		if(this.map == null)
			throw "Map should be set before doors.";

		this.doors = doors;

		this.doors.forEach((door) => {
			this.map.closeTileWith(door);
		});
	}

	setKeys(keys){
		if(this.map == null)
			throw "Map should be set before keys.";

		this.keys = keys;

		this.keys.forEach((key) => {
			this.map.openUpTileWith(key);
		});
	}

	setDestructiblesWalls(destructiblesWalls){
		if(this.map == null)
			throw "Map should be set before destructiblesWalls.";

		this.destructiblesWalls = destructiblesWalls;

		this.destructiblesWalls.forEach((destructibleWall) => {
			this.map.blockTileWith(destructibleWall);
		});
	}

	setEnemies(enemies){
		if(this.map == null)
			throw "Map should be set before enemies.";

		this.enemies = enemies;
		this.enemies.forEach((enemy) => {
			this.map.antogoniseTileWith(enemy);
		});
	}

	setPowers(powers){
		if(this.map == null)
			throw "Map should be set before powers.";

		this.powers = powers;
		this.powers.forEach((power) => {
			this.map.powerUpTileWith(power);
		});
	}

	removeEnemy(enemy) {
		removeFromArray(this.enemies, enemy);
	}

	removeDestructibleWall(destructibleWall) {
		removeFromArray(this.destructiblesWalls, destructibleWall);
	}

	update(){
		this.updateStartTimer();
		this.updateMap();
		this.updatePopulation();
	}

	updateStartTimer(){
		if(this.startInfosTimer != null){
			this.startInfosTimer.update();
			if(this.startInfosTimer.isStopped())
				this.startInfosTimer = null;
		}
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

		this.destructiblesWalls.forEach((destructibleWall) => {
			destructibleWall.update();
		});
	}

	render(){
		this.renderMap();
		this.renderPopulation();
		this.world.renderCurrentPortal();
		this.renderStartTimerInfos();
	}

	renderStartTimerInfos(){
		if(this.startInfosTimer != null){
			let secLeft = castToInt((this.startInfosTimer.getLimit() - this.startInfosTimer.getUpdates() + 60) / 60);
			let levelNumberText = "Level " + this.id;
			let levelNameText = "\"" + this.levelName.trim() + "\"";

			let ts = MapContext.getTileSize();
			let w = RenderingContext.getCanvasWidth(this.canvas);
			let h = RenderingContext.getCanvasHeight(this.canvas);

			let color = "White" // DarkRed;
			let fontSize = 50;
			let font = fontSize + "px serif";

			let x = (w * 0.5) - ((levelNumberText.length * 0.25) * fontSize);
			let y = h * 0.3;

			let lengthDiff = Math.abs(levelNumberText.length - levelNameText.length) * fontSize;

			renderFontText(this.ctx, levelNumberText, x, y, color, font);
			renderFontText(this.ctx, levelNameText, x - (lengthDiff * 0.125), y + ts, color, font);
		}
	}

	renderMap(){
		this.map.render();
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

		this.destructiblesWalls.forEach((destructibleWall) => {
			destructibleWall.render();
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
	getDestructiblesWalls(){return this.destructiblesWalls;}
	getWalls(){return this.walls;}
	getDoors(){return this.doors;}
	getSource(){return this.source;}
	getPlayerInitX(){return this.playerInitX;}
	getPlayerInitY(){return this.playerInitY;}
	getPlayerInitPower(){return this.playerInitPower;}

}