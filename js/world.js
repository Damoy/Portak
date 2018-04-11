var mainPlayer = null;

var WorldContext = {
	getBasePlayer : function(ctx, canvas, world){
		return new Player(ctx, canvas, world, 0, 0,
			MapContext.getTileSize(), MapContext.getTileSize(), "Cornflowerblue", 0, 0);
	},

	getBaseLevel : function(ctx, canvas, world){
		return new Level(1, ctx, canvas, world);
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
		// level 1
		this.currentLevel = WorldContext.getBaseLevel(ctx, canvas, this);
		this.currentLevel.generate();
		this.levels.push(this.currentLevel);
		// level 2
		// var level2 = new Level(2, ctx, canvas, this);
		// level2.generate();
		// this.levels.push(level2);

		// // var portal1to2 = new Portal(this.ctx, this.canvas, this, this.currentLevel, 20, 20);
		// let nextId = this.currentLevel.getId() + 1;
		// this.currentLevel.getPortal().linkTo(this.levels[nextId], 40, 40);
		// this.currentLevel.setPortal(this.currentLevel.getPortal());

		// player
		this.player = WorldContext.getBasePlayer(ctx, canvas, this);
		mainPlayer = this.player;

		println("World: OK.");
	}

	// link(){
	// 	var portal1to2 = new Portal(this.ctx, this.canvas, this, this.currentLevel, 20, 20);
	// 	let nextId = portal1to2.getId() + 1;
	// 	portal1to2.linkTo(this.levels[nextId], 40, 40);
	// 	this.currentLevel.setPortal(portal1to2);
	// 	return this;
	// }

	update(){
		this.currentLevel.update();
		this.player.update();
	}

	render(){
		this.currentLevel.render();
		this.player.render();
	}

	teleportPlayer(destLevel, x, y){
		this.currentLevel = destLevel;
		this.player.moveTo(x, y);
	}

	getPlayer(){return this.player;}
	getCurrentLevel(){return this.currentLevel;}
	getContext(){return this.ctx;}
	getCanvas(){return this.canvas;}
}