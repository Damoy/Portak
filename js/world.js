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
		levels.push(LevelLoadingContext.loadLevelFromFile(ctx, canvas, world, "res/levels/4.lvl"));
		levels.push(LevelLoadingContext.loadLevelFromFile(ctx, canvas, world, "res/levels/5.lvl"));
		levels.push(LevelLoadingContext.loadLevelFromFile(ctx, canvas, world, "res/levels/6.lvl"));
		levels.push(LevelLoadingContext.loadLevelFromFile(ctx, canvas, world, "res/levels/7.lvl"));
		levels.push(LevelLoadingContext.loadLevelFromFile(ctx, canvas, world, "res/levels/8.lvl"));
		levels.push(LevelLoadingContext.loadLevelFromFile(ctx, canvas, world, "res/levels/9.lvl"));
		levels.push(LevelLoadingContext.loadLevelFromFile(ctx, canvas, world, "res/levels/10.lvl"));
		levels.push(LevelLoadingContext.loadLevelFromFile(ctx, canvas, world, "res/levels/11.lvl"));
		levels.push(LevelLoadingContext.loadLevelFromFile(ctx, canvas, world, "res/levels/12.lvl"));

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
		this.currentLevelId = 12;
		this.portals = [];
		this.lastLevelAdditionalPortals = [];
		this.currentPortal = null;

		println("World: OK.");
	}

	start(){
		mainMenu = null;
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
		this.updateBackgroundMusic();
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

	updateBackgroundMusic(){
		SoundContext.accelerateBackgroundMusic();
	}

	generatePortal(id, x, y){
		this.portals.push(new Portal(id, ctx, canvas, world, x, y));
	}

	generatePortalsFinalLevel(id, x, y){
		this.lastLevelAdditionalPortals.push(new Portal(id, ctx, canvas, world, x, y));
	}

	destroyPortal(portal){
		removeFromArray(this.portals, portal);
	}

	clear(){
		this.levels = [];
		this.currentLevel = null;
		this.currentLevelId = 0;
		this.portals = [];
		this.currentPortal = null;
	}

	resetCurrentLevel(){
		this.currentLevel = LevelLoadingContext.loadLevelFromFileGivenId(this.currentLevel.getId(), ctx, canvas, world, this.currentLevel.getSource());
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
			if(this.lastLevelAdditionalPortals != null && this.currentLevelId == 12) {
				this.lastLevelAdditionalPortals.forEach((portal) => {
				portal.update();
			});
		}
	}

	render(){
		this.currentLevel.render();
		this.player.render();
	}

	renderCurrentPortal(){
		if(this.currentPortal != null)
			this.currentPortal.render();
		if(this.lastLevelAdditionalPortals != null && this.currentLevelId == 12) {
			this.lastLevelAdditionalPortals.forEach((portal) => {
				portal.render();
			});
		}
	}

	portalCollision(x, y){
		if(this.currentPortal == null) return null;

		let playerTile = this.currentLevel
						.getMap()
						.getNormTileAt(x, y);

		let portalTile = this.currentLevel
					.getMap()
					.getNormTileAt(this.currentPortal.getX(), this.currentPortal.getY());

		if(playerTile == portalTile)
			return this.currentPortal;

		return null;
	}

	getPlayer(){return this.player;}
	getCurrentLevel(){return this.currentLevel;}
	getContext(){return this.ctx;}
	getCanvas(){return this.canvas;}
}