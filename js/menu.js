class Menu{
    constructor(ctx, canvas, world){
        this.ctx = ctx;
        this.canvas = canvas;
        this.world = world;
        this.backgroundLevel = LevelLoadingContext.loadLevelFromFileGivenId(-1, ctx, canvas, world, LevelLoadingContext.getMenuFilePath());
        this.world.currentLevel = this.backgroundLevel;
        this.selection = 0;
        this.optionsCount = 3;
        this.renderingColor = "White";
        this.renderingFont = "50px serif";
        this.selectionTimer = new TickCounter(10);
        this.canSelect = true;
    }

    update(){
        this.backgroundLevel.update();
        this.handleInput();
        this.updateSelectionTimer();
    }

    updateSelectionTimer(){
        if(this.selectionTimer.isStopped()){
            this.canSelect = true;
            this.selectionTimer.reset();
        } else {
            this.selectionTimer.update();
        }

        if(this.launchGameTimer == null) return;
        this.launchGameTimer.update();
        if(this.launchGameTimer.isStopped()){
            this.launchGameTimer = null;
            this.launchGame();
        }
    }

    render(){
        this.backgroundLevel.render();
        this.renderInfos();
    }

    renderInfos(){
        let ts = MapContext.getTileSize();
        let x = RenderingContext.getCanvasWidth(this.canvas) * 0.5 - ts;
        let y = RenderingContext.getCanvasHeight(this.canvas) * 0.5 - ts;

        let font = this.renderingFont;
        let color = this.renderingColor;
        let changeFont = "75px serif";
        let changeColor = "LightGreen";

        if(this.selection == 0){
            font = changeFont;
            color = changeColor;
        }

        renderText(this.ctx, "Play", x, y, color, font);
        font = this.renderingFont;
        color = this.renderingColor;

        if(this.selection == 1){
            font = changeFont;
            color = changeColor;
        }

        renderText(this.ctx, "Options", x, y + ts, color, font);
        font = this.renderingFont;
        color = this.renderingColor;

        if(this.selection == 2){
            font = changeFont;
            color = changeColor;
        }

        renderText(this.ctx, "Credits", x, y + ts + ts, color, font);
        font = this.renderingFont;
        color = this.renderingColor;
    }

    handleInput(){
        if(this.launchGameTimer != null) return;

        if(isPressed(EventContext.upKey()) && this.canSelect){
            --this.selection;
            this.canSelect = false;
            this.selectionTimer.reset();
            if(this.selection < 0)
                this.selection = 0;
            else 
                SoundContext.getMenuOptionSound().play();
        }

        if(isPressed(EventContext.downKey()) && this.canSelect){
            ++this.selection;
            this.canSelect = false;
            this.selectionTimer.reset();
            if(this.selection >= this.optionsCount)
                this.selection = this.optionsCount - 1;
            else
                SoundContext.getMenuOptionSound().play();
        }

        if(isPressed(EventContext.resetKey())){
            println("go");
            if(this.selection == 0){
                SoundContext.getMenuSelectionSound().play();
                this.launchGameTimer = new TickCounter(6);
            }
        }
    }

    launchGame(){
        start();
    }
}