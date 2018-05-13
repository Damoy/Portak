var ARCADECLASSIC = 'ARCADECLASSIC';
var userPlayerSelection = "res/textures/player/normalPlayer.png";
var userPlayerIcon = null;

var MenuContext = {
    init(){
      userPlayerIcon = TextureContext.getNormalPlayerIcon();
    },

    getUserPlayerSelection : function(){
        return userPlayerSelection;
    },

    setUserPlayerSelection : function(path){
        userPlayerSelection = path;
    },

    getUserPlayerIcon : function(){
        return userPlayerIcon;
    },

    setUserPlayerIcon : function(texture){
        userPlayerIcon = texture;
    }
};

class Menu{
    constructor(ctx, canvas, world){
        this.ctx = ctx;
        this.canvas = canvas;
        this.world = world;
        this.backgroundLevel = LevelLoadingContext.loadLevelFromFileGivenId(-1, ctx, canvas, world, LevelLoadingContext.getMenuFilePath());
        this.world.currentLevel = this.backgroundLevel;
        this.selection = 0;
        this.maxSelection = 3;
        this.renderingColor = "White";
        this.renderingFont = "50px " + ARCADECLASSIC;
        this.selectionTimer = new TickCounter(10);
        this.canSelect = true;
        this.mod = 0;
        this.maxMods = 4;
        this.mute = false;
        this.savedSelection = 0;
        this.savedSelection2 = -1;
    }

    update(){
        this.backgroundLevel.update();
        this.updateSelectionTimer();

        switch(this.mod){
            case 0:
                this.handleMainInput();
                break;
            case 1:
                this.handleOptionsInput();
                break;
            case 2:
                this.handleCreditsInput();
                break;
            case 3:
                this.handlePlayerSelectionInput();
                break;
        }

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

    setMod(mod){
        if(mod == 0)
            this.maxSelection = 3;
        else if(mod == 1)
            this.maxSelection = 2;
        
        else if(mod == 3){
            this.maxSelection = 4;
            this.selection = 0;
        }

        this.preventSelection();

        if(mod > this.mod)
            this.selection = 0;
        else if(mod < this.mod){
            if(this.savedSelection2 != -1){
                this.selection = this.savedSelection2;
            } else {
                this.selection = this.savedSelection;
            }
        }

        if(this.selection >= this.maxSelection){
            this.selection = this.maxSelection - 1;
        }

        this.mod = mod;
        if(this.mod < 0)
            this.mod = 0;

        if(this.mod >= this.maxMods)
            this.mod = this.maxMods - 1;

        println("Set mod: " + this.mod);
    }

    resetSelection(){
        if(this.selectionTimer == null){
            this.selectionTimer = new TickCounter(10);
        }

        this.selectionTimer.reset();
        this.canSelect = false;
        this.selection = 0;
    }

    render(){
        this.backgroundLevel.render();
        switch(this.mod){
            case 0:
                this.renderMain();
                break;
            case 1:
                this.renderOptions();
                break;
            case 2:
                this.renderCredits();
                break;
            case 3:
                this.renderPlayerSelection();
                break;
        }
    }

    renderMain(){
        let ts = MapContext.getTileSize();
        let x = RenderingContext.getCanvasWidth(this.canvas) * 0.5 - ts;
        let y = RenderingContext.getCanvasHeight(this.canvas) * 0.5 - ts;

        let font = this.renderingFont;
        let color = this.renderingColor;

        this.renderIcon(x, y, ts, this.selection);

        renderText(this.ctx, "Play", x, y, color, font);
        renderText(this.ctx, "Options", x, y + ts, color, font);
        renderText(this.ctx, "Credits", x, y + ts + ts, color, font);
    }

    renderIcon(x, y, ts, selection){
        MenuContext.getUserPlayerIcon().render(x - ts * 1.375, y - 40 + ts * selection);
    }

    renderOptions(){
        let ts = MapContext.getTileSize();
        let x = RenderingContext.getCanvasWidth(this.canvas) * 0.5 - ts;
        let y = RenderingContext.getCanvasHeight(this.canvas) * 0.5 - ts;

        let font = this.renderingFont;
        let color = this.renderingColor;

        this.renderIcon(x, y, ts, this.selection);

        if(this.mute){
            renderText(this.ctx, "Unmute", x, y, color, font);
        } else {
            renderText(this.ctx, "Mute", x, y, color, font);
        }

        renderText(this.ctx, "Player selection", x, y + ts, color, font);
    }

    renderCredits(){
        let ts = MapContext.getTileSize();
        let x = RenderingContext.getCanvasWidth(this.canvas) * 0.5 - ts;
        let y = RenderingContext.getCanvasHeight(this.canvas) * 0.5 - ts;

        let font = this.renderingFont;
        let color = this.renderingColor;
        let changeFont = "75px " + ARCADECLASSIC;
        let changeColor = "LightGreen";

        renderText(this.ctx, "Ti ve de sou ?", x, y, color, font);
    }

    renderPlayerSelection(){
        let ts = MapContext.getTileSize();
        let x = 4 * ts + 8;
        let y = 5 * ts + 6;

        let font = this.renderingFont;
        let color = this.renderingColor;
        let changeFont = "75px " + ARCADECLASSIC;
        let changeColor = "LightGreen";

        renderText(this.ctx, "Player selection", x + ts, y - ts - ts - 8, changeColor, font);

        this.renderPlayerSelection2(x, y, this.selection, ts);

        TextureContext.getNormalPlayerTexture().render(x, y);
        TextureContext.getBluePlayerTexture().render(x + (ts * 2), y);
        TextureContext.getGreenPlayerTexture().render(x + (ts * 4), y);
        TextureContext.getPinkPlayerTexture().render(x + (ts * 6), y);
    }

    renderPlayerSelection2(x, y, selection, ts){
        MenuContext.getUserPlayerIcon().render(x - 12 + (selection * (ts * 2)) + ts * 0.25 - 4, y + ts + (ts >> 2));
    }

    renderTileHighlight(baseX, baseY, pselection, ts){
        let xoff = pselection * (ts * 2) - 8;
        this.ctx.save();
        this.ctx.fillStyle = "LightGreen";
        this.ctx.rect(baseX + xoff, baseY - 6, ts - 1, ts - 1);
        this.ctx.fill();
        this.ctx.restore();
    }

    preventSelection(){
        this.canSelect = false;
        this.selectionTimer.reset();
    }

    optionInput(){
        if(isPressed(EventContext.upKey()) && this.canSelect){
            --this.selection;
            this.savedSelection = this.selection;
            this.preventSelection();

            if(this.selection < 0){
                this.selection = 0;
                this.savedSelection = this.selection;
            }
            else 
                SoundContext.getMenuOptionSound().play();
        }

        if(isPressed(EventContext.downKey()) && this.canSelect){
            ++this.selection;
            this.savedSelection = this.selection;
            this.preventSelection();

            if(this.selection >= this.maxSelection){
                this.selection = this.maxSelection - 1;
                this.savedSelection = this.selection;
            }
            else
                SoundContext.getMenuOptionSound().play();
        }
    }

    handleMainInput(){
        if(this.launchGameTimer != null) return;

        this.optionInput();

        if(isPressed(EventContext.resetKey()) && this.canSelect){
            this.preventSelection();
            SoundContext.getMenuSelectionSound().play();

            if(this.selection == 0){
                this.canSelect = false;
                this.launchGameTimer = new TickCounter(6);
            } else{
                this.setMod(this.selection);
            }
        }
    }

    handleOptionsInput(){
        this.optionInput();

        if(isPressed(EventContext.resetKey()) && this.canSelect){
            this.preventSelection();

            if(this.selection == 0){
                if(this.mute){
                    SoundContext.enableSoundsNoCheck();
                    this.mute = false;
                    println("go unmute");

                    if(this.selection < 0)
                        this.selection = 0;
                    else
                        SoundContext.getMenuOptionSound().play();
                } else {
                    SoundContext.disableSoundsNoCheck();
                    this.mute = true;
                    println("go unmute");

                    if(this.selection < 0)
                        this.selection = 0;
                    else
                        SoundContext.getMenuOptionSound().play();
                }
            } else if(this.selection == 1){
                this.savedSelection2 = this.savedSelection;
                this.setMod(3);
            }
        } 

        if(isPressed(EventContext.escapeKey()) && this.canSelect){
            this.setMod(0);
        }
    }

    handleCreditsInput(){
        if(isPressed(EventContext.escapeKey()) && this.canSelect){
            this.setMod(0);
        }
    }

    setPlayerSelection(selection){
        let path = "res/textures/player/";
        switch(selection){
            case 0:
                path += "normalPlayer.png";
                MenuContext.setUserPlayerIcon(TextureContext.getNormalPlayerIcon());
                break;
            case 1:
                path += "bluePlayer.png";
                MenuContext.setUserPlayerIcon(TextureContext.getBluePlayerIcon());
                break;
            case 2:
                path += "greenPlayer.png";
                MenuContext.setUserPlayerIcon(TextureContext.getGreenPlayerIcon());
                break;
            case 3:
                path += "pinkPlayer.png";
                MenuContext.setUserPlayerIcon(TextureContext.getPinkPlayerIcon());
                break;
        }

        MenuContext.setUserPlayerSelection(path);
    }

    handlePlayerSelectionInput(){
        if(isPressed(EventContext.leftKey()) && this.canSelect){
            --this.selection;
            this.savedSelection = this.selection;
            this.preventSelection();

            if(this.selection < 0){
                this.selection = 0;
                this.savedSelection = this.selection;
            }
            else 
                SoundContext.getMenuOptionSound().play();
        }

        if(isPressed(EventContext.rightKey()) && this.canSelect){
            ++this.selection;
            this.savedSelection = this.selection;
            this.preventSelection();

            if(this.selection >= this.maxSelection){
                this.selection = this.maxSelection - 1;
                this.savedSelection = this.selection;
            }
            else
                SoundContext.getMenuOptionSound().play();
        }

        if(isPressed(EventContext.resetKey()) && this.canSelect){
            this.preventSelection();
            SoundContext.getMenuOptionSound().play();
            this.setPlayerSelection(this.selection);
            // this.setMod(1);
            // this.savedSelection2 = -1;
        }

        if(isPressed(EventContext.escapeKey()) && this.canSelect){
            this.setMod(1);
            this.savedSelection2 = -1;
        }
    }

    launchGame(){
        start();
    }
}