var PlayerContext = {
	getBaseEnergy : function(){return 10;},
	getBaseMaxSpeed : function(){return MapContext.getTileSize() >> 1;}, // >> 1
	getLeftDirValue : function(){return 0;},
	getUpDirValue : function(){return 1;},
	getRightDirValue : function(){return 2;},
	getDownDirValue : function(){return 3;},
	getNoneDirValue : function(){return -1;}
};

class Player extends Entity{
	constructor(ctx, canvas, world, x, y, w, h, color, speedX, speedY){
		super(ctx, canvas, world, x, y, w, h, color, speedX, speedY);

		println("Player generation...");

		this.energy = PlayerContext.getBaseEnergy();
		this.maxSpeed = PlayerContext.getBaseMaxSpeed();
		this.level = this.world.getCurrentLevel();
		this.map = this.level.getMap();

		// for move purposes
		this.blocked = false;
		this.tileDestReached = true;

		this.lastDx = 0;
		this.lastDy = 0;
		this.xSave = this.x;
		this.ySave = this.y;

		this.direction = PlayerContext.getNoneDirValue();
		this.savedDirection = PlayerContext.getDownDirValue();

		this.projectiles = [];
		this.deadProjectiles = [];

		println("Player: OK.");
	}

	update(){
		if(!this.isDead()) {
			this.handleInput();
			this.move();
			this.checkBoundCollisions();
			this.updateProjectiles();
		}
	}

	handleInput(){
		if(isPressed(EventContext.upKey())){
			this.changeDirection(PlayerContext.getUpDirValue());
		} else if(isPressed(EventContext.leftKey())){
			this.changeDirection(PlayerContext.getLeftDirValue());
		} else if(isPressed(EventContext.downKey())){
			this.changeDirection(PlayerContext.getDownDirValue());
		} else if(isPressed(EventContext.rightKey())){
			this.changeDirection(PlayerContext.getRightDirValue());
		} else if(isPressed(EventContext.spaceKey())) {
			println("Licorne");
			let projectile = new PlayerProjectile(this.ctx, this.canvas, this.world, this.x + this.w, this.y + this.h, this.savedDirection);
			this.projectiles.push(projectile);
		}

	}

	move(){
		if(this.tileDestReached){
			let dx = 0;
			let dy = 0;
			let offset = 2; // 1 ; PlayerContext.getBaseMaxSpeed() >> 1 MapContext.getTileSize() >> 2
			this.xSave = this.x;
			this.ySave = this.y;

			switch(this.direction){
				case PlayerContext.getLeftDirValue(): // left
					dx = -offset;
					this.lastDx = dx;
					break;
				case PlayerContext.getUpDirValue(): // up
					dy = -offset;
					this.lastDy = dy;
					break;
				case PlayerContext.getRightDirValue(): // right
					dx = offset;
					this.lastDx = dx;
					break;
				case PlayerContext.getDownDirValue(): // down
					dy = offset;
					this.lastDy = dy;
					break;
				default:
					return;
			}

			//this.blocked = !this.move2(dx, 0) && !this.move2(0, dy);
			// if(dx != 0 && this.move2(dx, 0)) this.blocked = false;
			// if(dy != 0 && this.move2(0, dy)) this.blocked = false;
			let xBlocked = this.move2(dx, 0);
			this.move2(0, dy);
			// if(xBlocked)
			// 	this.blocked = true;

			this.requireBoxSync();
			this.updateBox();
		} else {
			this.move2(this.lastDx, 0);
			this.move2(0, this.lastDy);

			//this.blocked = !this.move2(this.lastDx, 0) && !this.move2(0, this.lastDy);
			// let xBlocked = this.move2(this.lastDx, 0);
			// this.move2(0, this.lastDy);
			// if(xBlocked)
			// 	this.blocked = true;
			// if(dx != 0 && this.move2(this.lastDx, 0)) this.blocked = false;
			// if(dy != 0 && this.move2(0, this.lastDy)) this.blocked = false;
			this.requireBoxSync();
			this.updateBox();
		}

		let xPlusTs = this.xSave + MapContext.getTileSize();
		let yPlusTs = this.ySave + MapContext.getTileSize();
		let xMinusTs = this.xSave - MapContext.getTileSize();
		let yMinusTs = this.ySave - MapContext.getTileSize();

		if(this.x >= xPlusTs || this.y >= yPlusTs || this.x <= xMinusTs || this.y <= yMinusTs){
			if(this.x >= xPlusTs)
				this.x = xPlusTs;
			else if(this.x <= xMinusTs)
				this.x = xMinusTs;

			if(this.y >= yPlusTs)
				this.y = yPlusTs;
			else if(this.y <= yMinusTs)
				this.y = yMinusTs;

			this.tileDestReached = true;
			this.subEnergy(1);
			this.lastDx = 0;
			this.lastDy = 0;
			this.direction = PlayerContext.getNoneDirValue();
			//println("End movement reached");
		} else {
			//println("Not movement end");
			if(!this.blocked){
				this.tileDestReached = false;
			} else{
				this.subEnergy(1);
				this.tileDestReached = true;
				this.lastDx = 0;
				this.lastDy = 0;
				this.direction = PlayerContext.getNoneDirValue();
			}
		}
	}

	move2(dx, dy){
		if(dx != 0 && dy != 0) throw "Player movement failed.";

		let xr = MapContext.getTileSize() - 1;
		let yr = xr;
		let sv = Math.log2(xr + 1);
		
		let rowTo0 = this.y >> sv;
		let colTo0 = this.x >> sv;
		let rowTo1 = (this.y + yr) >> sv;
		let colTo1 = (this.x + xr) >> sv;

		let row0 = (this.y + dy) >> sv;
		let col0 = (this.x + dx) >> sv;
		let row1 = (this.y + dy + yr) >> sv;
		let col1 = (this.x + dx + xr) >> sv;

		for(let row = row0; row <= row1; ++row){
			for(let col = col0; col <= col1; ++col){
				if(col >= colTo0 && col <= colTo1 && row >= rowTo0 && row <= rowTo1) continue;
				if(row < 0 || row >= this.map.getNumRows() || col < 0 || col >= this.map.getNumCols()) continue;

				let tile = this.map.getTileAt(row, col);
				if(tile != null) {
					if(tile.isOccupied()){
						this.tileDestReached = true;
						this.lastDx = 0;
						this.lastDy = 0;
						this.direction = PlayerContext.getNoneDirValue();
						this.blocked = true;
						return false;
					} else if(tile.isPoweredUp()){
						this.addEnergy(tile.getPower().getValue());
						tile.unpower();
					}
				}
			}
		}

		this.blocked = false;
		this.addX(dx);
		this.addY(dy);

		// can move
		return true;
	}

	changeDirection(dir){
		if(this.tileDestReached){
			this.stopped = false;
			this.direction = dir;
			this.saveDirection();
		}
	}

	saveDirection(){
		if(this.direction != PlayerContext.getNoneDirValue()){
			this.savedDirection = this.direction;
		}
	}

	stop(){
		if(this.tileDestReached)
			this.stopped = true;
	}

	checkBoundCollisions(){
		if(this.x < 0){
			this.x = 0;

			this.tileDestReached = true;
			this.lastDx = 0;
			this.lastDy = 0;
			this.direction = PlayerContext.getNoneDirValue();
			this.blocked = true;
		}

		if(this.x + this.w > RenderingContext.getCanvasWidth(this.canvas)){
			this.x = RenderingContext.getCanvasWidth(this.canvas) - this.w;

			this.tileDestReached = true;
			this.lastDx = 0;
			this.lastDy = 0;
			this.direction = PlayerContext.getNoneDirValue();
			this.blocked = true;
		}

		if(this.y < 0){
			this.y = 0;

			this.tileDestReached = true;
			this.lastDx = 0;
			this.lastDy = 0;
			this.direction = PlayerContext.getNoneDirValue();
			this.blocked = true;
		}

		if(this.y + this.h > RenderingContext.getCanvasHeight(this.canvas)){
			this.y = RenderingContext.getCanvasHeight(this.canvas) - this.h;

			this.tileDestReached = true;
			this.lastDx = 0;
			this.lastDy = 0;
			this.direction = PlayerContext.getNoneDirValue();
			this.blocked = true;
		}
	}

	updateProjectiles(){
		this.projectiles.forEach((proj) => {
			proj.update();
		});
		this.checkProjectilesState();
	}

	checkProjectilesState(){
		for(let i = 0; i < this.projectiles.length; i++) {
			let proj = this.projectiles[i];
			if(proj.isDead()){
				this.deadProjectiles.push(proj);
			}
		}

		for(let i = 0; i < this.deadProjectiles.length; i++) {
			this.removeProjectile(this.deadProjectiles[i]);
		}
	}

	removeProjectile(projectile){
		removeFromArray(this.projectiles, projectile);
	}

	addToDeadProjectiles(projectile) {
		this.deadProjectiles.push(projectile);

	}

	render(){
		this.renderEntity();
		this.renderEnergy();
		this.renderProjectiles();
	}

	renderProjectiles(){
		this.projectiles.forEach((proj) => {
			proj.render();
		});
	}

	renderEntity(){
		ctx.save();
		ctx.fillStyle = this.color;

		this.renderAccordingToDirection(this.direction);

		if(this.direction == PlayerContext.getNoneDirValue()){
			this.renderAccordingToDirection(this.savedDirection);
		}

		ctx.restore();
	}

	renderEnergy(){
		// renderComposedText(this.ctx, "Power: ", this.energy, this.canvas.width * 10 / 100, MapContext.getTileSize() * 3.25, this.canvas.height * 10 / 100, 0, "MediumSeaGreen");
		renderComposedText(this.ctx, this.energy, " power", RenderingContext.getCanvasWidth(this.canvas) * (40 / 100), MapContext.getTileSize() * 1.2, RenderingContext.getCanvasHeight(this.canvas) + (RenderingContext.getUIHeight() >> 1), 0, "DarkGreen");
	}

	renderAccordingToDirection(dir){
		switch(dir){
			case PlayerContext.getLeftDirValue():
				ctx.fillRect(this.x + (this.w >> 3), this.y, this.w - (this.w >> 3), this.h);
				ctx.fillStyle = "RoyalBlue";
				ctx.fillRect(this.x, this.y, this.w >> 3, this.h);
				break;
			case PlayerContext.getUpDirValue():
				ctx.fillRect(this.x, this.y + (this.h >> 3), this.w, this.h - (this.h >> 3));
				ctx.fillStyle = "RoyalBlue";
				ctx.fillRect(this.x, this.y, this.w, this.h >> 3);
				break;
			case PlayerContext.getRightDirValue():
				ctx.fillRect(this.x, this.y, this.w - (this.w >> 3), this.h);
				ctx.fillStyle = "RoyalBlue";
				ctx.fillRect(this.x + (this.w - (this.w >> 3)), this.y, this.w >> 3, this.h);
				break;
			case PlayerContext.getDownDirValue():
				ctx.fillRect(this.x, this.y, this.w, this.h - (this.h >> 3));
				ctx.fillStyle = "RoyalBlue"; // RoyalBlue DodgerBlue
				ctx.fillRect(this.x, this.y + (this.h - (this.h >> 3)), this.w, this.h >> 3);
				break;
			}
	}

	addEnergy(value){this.energy += value;}
	subEnergy(value){this.energy -= value;}
	getEnergy(){return this.energy;}
	getMaxSpeed(){return this.maxSpeed;}
	isDead(){return (this.energy == 0);}
}