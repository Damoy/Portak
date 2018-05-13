class TickCounter{
	constructor(limit){
		this.updates = 0;
		this.limit = limit;
		this.stopped = false;
	}

	update(){
		if(this.stopped)
			return;

		this.updates++;

		if(this.updates >= this.limit){
			this.stopped = true;
		}

		return this.updates;
	}

	reset(){
		this.updates = 0;
		this.stopped = false;
	}

	resetWith(newLimit){
		this.reset();
		this.limit = newLimit;
	}

	resetOf(updatesOffset){
		this.updates = updatesOffset;
		this.stopped = false;
	}

	getUpdates(){
		return this.updates;
	}

	getLimit(){
		return this.limit;
	}

	isStopped(){
		return this.stopped;
	}
}