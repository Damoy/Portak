class EnemyProjectile extends Projectile{
	constructor(ctx, canvas, world, x, y, direction){
		super(ctx, canvas, world, x, y, 20, 10, direction);
		println("EnnemyProjectile: OK.");
	}

	update(){
		super.update();
	}

	render(){
		super.render();
	}

}


