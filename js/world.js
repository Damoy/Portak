var mainPlayer = null;
var endgameLevel = null;
var endgamePortals = [];

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

		endgameLevel = LevelLoadingContext.loadLevelFromFile(ctx, canvas, world, "res/levels/end.lvl");
		let endPtr = world.lastLevelAdditionalPortals.length - 1;
		if(endPtr < 0) return levels;

		let lastPortal = world.lastLevelAdditionalPortals[endPtr];
		let llastPortal = world.lastLevelAdditionalPortals[endPtr - 1];
		let lllastPortal = world.lastLevelAdditionalPortals[endPtr - 2];

		endgamePortals[0] = lastPortal;
		endgamePortals[1] = llastPortal;
		endgamePortals[2] = lllastPortal;

		removeFromArray(world.lastLevelAdditionalPortals, lllastPortal);
		removeFromArray(world.lastLevelAdditionalPortals, llastPortal);
		removeFromArray(world.lastLevelAdditionalPortals, lastPortal);

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
		this.lastLevelAdditionalPortals = [];
		this.currentPortal = null;

		// endgame
		this.endgame = false;

		// endgame textures
		this.normalPlayerCounter = null;
		this.greenPlayerCounter = null;
		this.bluePlayerCounter = null;
		this.pinkPlayerCounter = null;

		// normal player texture reference...
		this.npt = TextureContext.getNormalPlayerTexture();
		this.bpt = TextureContext.getBluePlayerTexture();
		this.gpt = TextureContext.getGreenPlayerTexture();
		this.ppt = TextureContext.getPinkPlayerTexture();

		this.nptFlip = false;
		this.bptFlip = false;
		this.gptFlip = false;
		this.pptFlip = false;

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
		// player still exists but we want to avoid collision with current portal
		SoundContext.getBackgroundMusic().stop();
		SoundContext.getEndGameMusic().play();
		this.player = null;
		this.endgame = true;
		this.currentLevel = endgameLevel;

		this.normalPlayerCounter = new TickCounter(30);
		this.greenPlayerCounter = new TickCounter(30);
		this.bluePlayerCounter = new TickCounter(30);
		this.pinkPlayerCounter = new TickCounter(30);

		// take in account the endgame portals
		this.lastLevelAdditionalPortals = [];
		endgamePortals.forEach((portal) => {
			this.lastLevelAdditionalPortals.push(portal);
		});
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

		if(this.player != null)
			this.player.update();

		if(this.endgame){
			this.updateEndgameCounters();
		}
	}

	updateEndgameCounters(){
		this.checkNptFlip();
		this.checkBptFlip();
		this.checkGptFlip();
		this.checkPptFlip();
	}

	checkNptFlip(){
		this.normalPlayerCounter.update();
		if(this.normalPlayerCounter.isStopped()){
			this.normalPlayerCounter.reset();
			this.nptFlip = !this.nptFlip;
		}
	}

	checkBptFlip(){
		this.bluePlayerCounter.update();
		if(this.bluePlayerCounter.isStopped()){
			this.bluePlayerCounter.reset();
			this.bptFlip = !this.bptFlip;
		}
	}

	checkGptFlip(){
		this.greenPlayerCounter.update();
		if(this.greenPlayerCounter.isStopped()){
			this.greenPlayerCounter.reset();
			this.gptFlip = !this.gptFlip;
		}
	}

	checkPptFlip(){
		this.pinkPlayerCounter.update();
		if(this.pinkPlayerCounter.isStopped()){
			this.pinkPlayerCounter.reset();
			this.pptFlip = !this.pptFlip;
		}
	}

	updateCurrentPortal(){
		if(this.currentPortal != null)
			this.currentPortal.update();
			if(this.lastLevelAdditionalPortals != null && (this.currentLevelId == 12 || this.endgame)) {
				this.lastLevelAdditionalPortals.forEach((portal) => {
				portal.update();
			});
		}
	}

	render(){
		if(!this.endgame){
			this.currentLevel.render();
			this.player.render();
		} else {
			this.renderEndGame();
		}
	}

	renderEndGame(){
		this.currentLevel.render();

		let ts = MapContext.getTileSize();
		let x = RenderingContext.getCanvasWidth(this.canvas) * 0.5 - ts;
		let y = RenderingContext.getCanvasHeight(this.canvas) * 0.5 - ts;

		renderText(this.ctx, "PORTAK", x - (ts * 2) - (ts >> 2), y - ts + 10, "DarkRed", 128);

		x = 4 * ts + 8;
		y = 5 * ts + 6 + ts;

		renderText(this.ctx, "Congratulations !", x - ts * 1.5, y - ts, "LightGreen", 72);
		
		this.renderPlayerTexture(this.npt, this.nptFlip, x, y);
		this.renderPlayerTexture(this.bpt, this.bptFlip, x + (ts * 2), y);
		this.renderPlayerTexture(this.gpt, this.gptFlip, x + (ts * 4), y);
		this.renderPlayerTexture(this.ppt, this.pptFlip, x + (ts * 6), y);
	}

	renderPlayerTexture(tex, flip, x, y){
		if(flip){
			tex.flipRender(x, y);
		} else {
			tex.render(x, y);
		}
	}

	renderCurrentPortal(){
		if(this.currentPortal != null)
			this.currentPortal.render();
		if(this.lastLevelAdditionalPortals != null && (this.currentLevelId == 12 || this.endgame)) {
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