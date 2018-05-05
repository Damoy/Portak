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
		this.currentPortal = null;

		println("World: OK.");
	}

	start(){
		// player
		this.player = WorldContext.getBasePlayer(ctx, canvas, this);
		mainPlayer = this.player;

		this.levels = WorldContext.loadLevels(ctx, canvas, this);
		this.updateCurrentLevel();
		this.updatePortal();
		this.player.changeLevel(this.currentLevel);
	}

	incrementLevel(){
		if(this.currentLevelId <= this.levels.length){
			++this.currentLevelId;
		} else {
			this.endGame();
		}
	}

	endGame(){
		println("ENDDDDDDDDDDDDD GAMEEEEEEEEEEEEEEEE");
	}

	upgradeLevel(){
		this.incrementLevel();
		this.updateCurrentLevel();
		this.updatePortal();
	}

	updatePortal(){
		if(this.currentLevel == null) this.endGame();
		for(let i = 0; i < this.portals.length; ++i){
			if(this.portals[i].getId() == this.currentLevel.getId()){
				this.currentPortal = this.portals[i];
			}
		}

		if(this.currentPortal == null) throw "Unknown portal";
	}

	generatePortal(id, x, y){
		this.portals.push(new Portal(id, ctx, canvas, world, x, y));
	}

	destroyPortal(portal){
		removeFromArray(this.portals, portal);
	}

	resetCurrentLevel(){
		this.currentLevel = LevelLoadingContext.loadLevelFromFile(ctx, canvas, world, this.currentLevel.getSource());
		this.player.reset();
		this.player.changeLevel(this.currentLevel);
	}

	updateCurrentLevel(){
		this.currentLevel = this.levels[this.currentLevelId];
		this.player.reset();
		this.player.changeLevel(this.currentLevel);
	}

	getLevel(lvlId){
		return this.levels[lvlId];
	}

	update(){
		this.currentLevel.update();
		this.updateCurrentPortal();
		this.player.update();
	}

	updateCurrentPortal(){
		if(this.currentPortal != null)
			this.currentPortal.update();
	}

	render(){
		this.currentLevel.render();
		this.renderCurrentPortal();
		this.player.render();
	}

	renderCurrentPortal(){
		if(this.currentPortal != null)
			this.currentPortal.render();
	}

	portalCollision(tile){
		if(this.currentPortal == null) return null;

		let ptile = this.currentLevel
					.getMap()
					.getNormTileAt(this.currentPortal.getX(), this.currentPortal.getY());
					
		if(ptile == tile)
			return this.currentPortal;

		return null;
	}

	getPlayer(){return this.player;}
	getCurrentLevel(){return this.currentLevel;}
	getContext(){return this.ctx;}
	getCanvas(){return this.canvas;}
}