
class Enemy extends Entity{
	constructor(ctx, canvas, world, x, y, color, speedX, speedY, strength){
		super(ctx, canvas, world, x, y, 20, 20, color, speedX, speedY);
		this.life = 1;
		this.strength = strength;

		println("Enemy generation...");
		println("Enemy: OK.");
	}

	update(){
		this.move();
	}

	move(){
		//Todo
	}

	render(){
		ctx.save();
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x, this.y, this.w, this.h);
		ctx.restore();
	}

	getLife(){return this.life;}
	getStrength(){return this.strength;}

	subLife(value){this.life -= value;}
}