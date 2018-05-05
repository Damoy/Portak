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

		this.levels = WorldContext.loadLevels(ctx, canvas, this);
		this.updateCurrentLevel();
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
		// if(this.currentLevelId > this.levels.length){
		// 	this.endGame();
		// } else{
		// 	this.incrementLevel();
		// 	this.updateCurrentLevel();
		// }
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
		let portal = this.portals[this.currentLevelId];
		if(portal != null)
			portal.update();
	}

	render(){
		this.currentLevel.render();
		this.renderCurrentPortal();
		this.player.render();
	}

	renderCurrentPortal(){
		let portal = this.portals[this.currentLevelId];
		if(portal != null)
			portal.render();
	}

	portalCollision(tile){
		let portal = this.portals[this.currentLevelId];
		if(portal == null) return null;

		let ptile = this.currentLevel
					.getMap()
					.getNormTileAt(portal.getX(), portal.getY());
					
		if(ptile == tile)
			return portal;

		return null;
	}

	getPlayer(){return this.player;}
	getCurrentLevel(){return this.currentLevel;}
	getContext(){return this.ctx;}
	getCanvas(){return this.canvas;}
}