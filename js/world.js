var mainPlayer = null;

var WorldContext = {
	getBasePlayer : function(ctx, canvas, world){
		return new Player(ctx, canvas, world, 0, 0,
			MapContext.getTileSize(), MapContext.getTileSize(), "Cornflowerblue", 0, 0);
	},

	getBaseLevel : function(ctx, canvas, world){
		return new Level(ctx, canvas, world);
	},

	getMainPlayer : function(){return mainPlayer;}
};

class World{
	constructor(ctx, canvas){
		println("World generation...");
		this.ctx = ctx;
		this.canvas = canvas;
		this.level = WorldContext.getBaseLevel(ctx, canvas, this);
		this.level.generate();
		this.player = WorldContext.getBasePlayer(ctx, canvas, this);
		mainPlayer = this.player;
		println("World: OK.");
	}

	update(){
		this.level.update();
		this.player.update();
	}

	render(){
		this.level.render();
		this.player.render();
	}

	getPlayer(){return this.player;}
	getCurrentLevel(){return this.level;}
	getContext(){return this.ctx;}
	getCanvas(){return this.canvas;}
}