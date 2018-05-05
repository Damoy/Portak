var mainPlayer = null;

var WorldContext = {
	getBasePlayer : function(ctx, canvas, world){
		return new Player(ctx, canvas, world, 0, 0,
			MapContext.getTileSize(), MapContext.getTileSize(), 0, 0);
	},

	getMainPlayer : function(){return mainPlayer;},

	loadLevels : function(ctx, canvas, world){
		var levels = [];
		levels.push(LevelLoadingContext.loadLevelFromFile(ctx, canvas, world, "res/levels/0.lvl"));
		levels.push(LevelLoadingContext.loadLevelFromFile(ctx, canvas, world, "res/levels/1.lvl"));
		levels.push(LevelLoadingContext.loadLevelFromFile(ctx, canvas, world, "res/levels/2.lvl"));
		levels.push(LevelLoadingContext.loadLevelFromFile(ctx, canvas, world, "res/levels/3.lvl"));
		return levels;
	}
};

class World{
	constructor(ctx, canvas){
		println("World generation...");
		
		// context references
		this.ctx = ctx;
		this.canvas = canvas;

		// leveling
		this.levels = [];
		this.currentLevel = null;
		this.currentLevelId = 0;
		this.portals = [];

		println("World: OK.");
	}

	start(){
		// player
		this.player = WorldContext.getBasePlayer(ctx, canvas, this);
		mainPlayer = this.player;

		// level 0

		this.levels = WorldContext.loadLevels(ctx, canvas, this);
		this.currentLevelId = 3;
		this.updateCurrentLevel();
		this.player.changeLevel(this.currentLevel);
		this.incrementLevel();
	}

	incrementLevel(){
		++this.currentLevelId;
		if(this.currentLevelId >= this.levels.length)
			this.endGame();
	}

	endGame(){
		println("ENDDDDDDDDDDDDD GAMEEEEEEEEEEEEEEEE");
	}

	resetCurrentLevel(){
		this.currentLevel = LevelLoadingContext.loadLevelFromFile(ctx, canvas, world, this.currentLevel.getSource());
	}

	updateCurrentLevel(){
		this.currentLevel = this.levels[this.currentLevelId];
	}

	getLevel(lvlId){
		return this.levels[lvlId];
	}

	// connectLevels(sourceLevelId, destLevelId, srcRow, srcCol, destRow, destCol){
	// 	for(let i = 0; i < this.portals.length; ++i){
	// 		let portal = this.portals[i];
	// 		// if portal from src level to dest level already exists, cancel connection
	// 		if(portal.getSrcLevelId() == sourceLevelId && portal.getDestLevelId() == destLevelId)
	// 			return false;
	// 	}

	// 	var newPortal = new Portal(this.ctx, this.canvas, this, sourceLevelId, destLevelId,
	// 								MapContext.getNormX(srcCol), MapContext.getNormY(srcRow), MapContext.getNormX(destCol), MapContext.getNormY(destRow));
	// 	this.portals.push(newPortal);
	// 	return true;
	// }

	update(){
		this.currentLevel.update();
		this.updatePortals();
		this.player.update();
	}

	updatePortals(){
		this.portals.forEach((portal) => {
			portal.update();
		});
	}

	render(){
		this.currentLevel.render();
		this.renderPortals();
		this.player.render();
	}

	renderPortals(){
		this.portals.forEach((portal) => {
			portal.render();
		});
	}

	portalCollision(tile){
		for(let i = 0; i < this.portals.length; ++i){
			let portal = this.portals[i];
			let ptile = this.currentLevel
						.getMap()
						.getNormTileAt(portal.getX(), portal.getY());
			if(ptile == tile)
				return portal;
		}

		return null;
	}

	teleportPlayerWith(portalTook, destLevelId, x, y){
		this.currentLevel = this.getLevel(destLevelId);
		println("New current level: " + this.currentLevel.getId());
		this.player.moveTo(x, y);
		removeFromArray(this.portals, portalTook);
		this.player.changeLevel(this.currentLevel);
	}

	getPlayer(){return this.player;}
	getCurrentLevel(){return this.currentLevel;}
	getContext(){return this.ctx;}
	getCanvas(){return this.canvas;}
}