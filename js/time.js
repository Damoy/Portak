class TickCounter{
	constructor(limit){
		this.ticks = 0;
		this.limit = limit;
		this.stopped = false;
	}

	tick(){
		if(this.stopped)
			return;

		this.ticks++;

		if(this.ticks >= this.limit){
			this.stopped = true;
		}

		return this.ticks;
	}

	reset(){
		this.ticks = 0;
		this.stopped = false;
	}

	resetWith(newLimit){
		this.reset();
		this.limit = newLimit;
	}

	resetOf(ticksOffset){
		this.ticks = ticksOffset;
		this.stopped = false;
	}

	getTicks(){
		return this.ticks;
	}

	getLimit(){
		return this.limit;
	}

	isStopped(){
		return this.stopped;
	}
}