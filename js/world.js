var mainPlayer = null;

var WorldContext = {
	getBasePlayer : function(ctx, canvas, world){
		return new Player(ctx, canvas, world, 0, 0,
			MapContext.getTileSize(), MapContext.getTileSize(), "Cornflowerblue", 0, 0);
	},

	getMainPlayer : function(){return mainPlayer;}
};

class World{
	constructor(ctx, canvas){
		println("World generation...");
		
		// context references
		this.ctx = ctx;
		this.canvas = canvas;

		// leveling
		this.levels = [];
		this.portals = [];

		// level 0
		this.currentLevel = this.generateRandomLevel();
		// level 1
		this.generateRandomLevel();
		// create portal
		println("Portal connection between level 0 et level 1: " + this.connectLevels(0, 1, 4, 4, 8, 8));

		// player
		this.player = WorldContext.getBasePlayer(ctx, canvas, this);
		this.player.changeLevel(this.currentLevel);
		mainPlayer = this.player;

		println("World: OK.");
	}

	resetCurrentLevel(){
		this.currentLevel.reset();
		this.player.reset();
	}

	generateRandomLevel(){
		let lvlId = this.levels.length;
		var level = new Level(lvlId, this.ctx, this.canvas, this, castToInt((lvlId + 1) * 10));
		level.generate();
		this.levels[lvlId] = level;
		println("Generated level " + lvlId + ".");
		return level;
	}

	getLevel(lvlId){
		return this.levels[lvlId];
	}

	connectLevels(sourceLevelId, destLevelId, srcRow, srcCol, destRow, destCol){
		for(let i = 0; i < this.portals.length; ++i){
			let portal = this.portals[i];
			// if portal from src level to dest level already exists, cancel connection
			if(portal.getSrcLevelId() == sourceLevelId && portal.getDestLevelId() == destLevelId)
				return false;
		}

		var newPortal = new Portal(this.ctx, this.canvas, this, sourceLevelId, destLevelId,
									MapContext.getNormX(srcCol), MapContext.getNormY(srcRow), MapContext.getNormX(destCol), MapContext.getNormY(destRow));
		this.portals.push(newPortal);
		return true;
	}

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
						.getNormTileAt(portal.getX() - portal.getRawRenderingXOffset(),
										portal.getY() - portal.getRawRenderingYOffset());
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

		// chaining
		//var generation = this.generateRandomLevel();
		//this.connectLevels(this.currentLevel.getId(), generation.getId(), 4, 4, 8, 8);
	}

	getPlayer(){return this.player;}
	getCurrentLevel(){return this.currentLevel;}
	getContext(){return this.ctx;}
	getCanvas(){return this.canvas;}
}