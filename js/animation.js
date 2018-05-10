var AnimationContext = {
    // null value in constructor parameter
    getNullValue : function(){return -1;},

    // direction values
    getLeftDirValue : function(){return 0;},
	getUpDirValue : function(){return 1;},
	getRightDirValue : function(){return 2;},
	getDownDirValue : function(){return 3;},
	getNoneDirValue : function(){return AnimationContext.getNullValue();}
};

// For now, horizontal spritesheets only.
class Animation{
    constructor(ctx, canvas, spritesheetTexturePath, sheetWidth, sheetHeight, yOffset, frameWidth, frameHeight,
        direction, frames, downFrames, upFrames, rightFrames, leftFrames, downDirStartX, upDirStartX, rightDirStartX, leftDirStartX){
        
        // rendering context
        this.ctx = ctx;
        this.canvas = canvas;

        // spritesheet start x by direction
        this.downDirStartX = downDirStartX;
        this.upDirStartX = upDirStartX;
        this.rightDirStartX = rightDirStartX;
        this.leftDirStartX = leftDirStartX;

        // actual spritesheet, one big texture
        this.sheet = new Texture(ctx, canvas, spritesheetTexturePath, sheetWidth, sheetHeight);

        // width and heights of one amimated frame
        this.frameWidth = frameWidth;
        this.frameHeight = frameHeight;

        // the total number of frames by direction
        this.downFrames = downFrames;
        this.upFrames = upFrames;
        this.rightFrames = rightFrames;
        this.leftFrames = leftFrames;

        // if the total number of frames is not provided ( == nullValue)
        // the animation does not handle directions
        if(frames <= 0 || frames == AnimationContext.getNullValue()){
            this.frames = this.getFrames(direction);
        } else {
            this.frames = frames;
        }

        // get the delays by frames lengths
        this.downDelay = this.getDelayFromFrames(downFrames);
        this.upDelay = this.getDelayFromFrames(upFrames);
        this.rightDelay = this.getDelayFromFrames(rightFrames);
        this.leftDelay = this.getDelayFromFrames(leftFrames);

        // the current delay is get from the direction
        // TODO handle when no direction
        this.delay = this.getDelay(direction);

        // one frame counter object by direction
        this.frameCounter = null;
        this.downFrameCounter = null;
        this.upFrameCounter = null;
        this.rightFrameCounter = null;
        this.leftFrameCounter = null;

        // start x position of clip rendering
        // according to direction
        this.startX = 0;
        // initial x save
        this.savedStartX = this.startX;
        // y-axis spritesheet offset
        this.yOffset = yOffset;

        // same direction as used by the entities of the ga;e
        this.direction = direction;

        // saves of initial values
        this.initDirection = this.direction;
        this.initDelay = this.delay;
        this.initLeftDelay = this.leftDelay;
        this.initRightDelay = this.rightDelay;
        this.initUpDelay = this.upDelay;
        this.initDownDelay = this.downDelay;
        this.initFrames = this.frames;
    }

    // start for "directed" spritesheet
    start(){
        // direction
        this.direction = this.setDirection(this.direction);
        // frame counters according to direction
        this.downFrameCounter = new TickCounter(this.downDelay);
        this.upFrameCounter = new TickCounter(this.upDelay);
        this.rightFrameCounter = new TickCounter(this.rightDelay);
        this.leftFrameCounter = new TickCounter(this.leftDelay);
        // initial frame counter
        this.frameCounter = this.getCounter(this.direction);
    }

    // animation updating
    update(){
        if(this.frameCounter == null)
            return;
        
        this.frameCounter.update();

        // time of frame update
        if(this.frameCounter.isStopped()){
            // increment the start x-axis value clip rendering
            this.startX += this.frameWidth;
            
            if(this.startX >= this.savedStartX + (this.frames * this.frameWidth) || this.startX >= this.savedStartX + (this.frames * this.frameWidth)){
                this.startX = this.savedStartX;
            }

            this.frameCounter.reset();
        }
    }

    getDelayFromFrames(frames){
        return frames << 3;
    }

    getFrames(direction){
        switch(direction){
			case AnimationContext.getDownDirValue():
				return this.downFrames;
			case AnimationContext.getUpDirValue():
				return this.upFrames;
			case AnimationContext.getRightDirValue():
				return this.rightFrames;
			case AnimationContext.getLeftDirValue():
				return this.leftFrames;
			default:
				return this.downFrames;			
		}         
    }

    getCounter(direction){
        switch(direction){
			case AnimationContext.getDownDirValue():
				return this.downFrameCounter;
			case AnimationContext.getUpDirValue():
				return this.upFrameCounter;
			case AnimationContext.getRightDirValue():
				return this.rightFrameCounter;
			case AnimationContext.getLeftDirValue():
				return this.leftFrameCounter;
			default:
				return this.downFrameCounter;			
		}       
    }

    getDelay(direction){
        switch(direction){
			case AnimationContext.getDownDirValue():
				return this.downDelay;
			case AnimationContext.getUpDirValue():
				return this.upDelay;
			case AnimationContext.getRightDirValue():
				return this.rightDelay;
			case AnimationContext.getLeftDirValue():
				return this.leftDelay;
			default:
				return this.downDelay;			
		}
    }

    getStartX(direction){
		switch(direction){
			case AnimationContext.getDownDirValue():
				return this.downDirStartX;
			case AnimationContext.getUpDirValue():
				return this.upDirStartX;
			case AnimationContext.getRightDirValue():
				return this.rightDirStartX;
			case AnimationContext.getLeftDirValue():
				return this.leftDirStartX;
			default:
				return this.downDirStartX;			
		}
    }
    
    setDirection(direction){
        if(direction != this.direction){
            this.frames = this.getFrames(direction);
            this.delay = this.getDelay(direction);
            this.direction = direction;
            this.startX = this.getStartX(direction);
            this.savedStartX = this.startX;
            this.frameCounter = this.getCounter(direction);
            this.frameCounter.reset();
        }
    }

    render(x, y){
        if(this.frameCounter == null)
            return;

        // clip rendering of the sprite sheet
        this.sheet.clippedRender(this.startX, this.yOffset, this.frameWidth, this.frameHeight, x, y, this.frameWidth, this.frameHeight);
    }

    // reset the initial values
    reset(){
        this.downDirStartX = this.downDirStartX;
        this.upDirStartX = this.upDirStartX;
        this.rightDirStartX = this.rightDirStartX;
        this.leftDirStartX = this.leftDirStartX;

        this.frames = this.initFrames;

        this.downDelay = this.initDownDelay;
        this.upDelay = this.initUpDelay;
        this.rightDelay = this.initRightDelay;
        this.leftDelay = this.initLeftDelay;
        this.delay = this.initDelay;

        this.frameCounter = null;
        this.downFrameCounter = null;
        this.upFrameCounter = null;
        this.rightFrameCounter = null;
        this.leftFrameCounter = null;

        this.startX = 0;
        this.direction = this.initDirection;
        this.savedStartX = this.startX;
    }

    getSpriteSheet(){return this.sheet;}
}
