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
        this.renderingFontSize = 72;
        this.selectionTimer = new TickCounter(10);
        this.canSelect = true;
        this.mod = 0;
        this.maxMods = 4;
        this.mute = false;
        this.savedSelection = 0;
        this.savedSelection2 = -1;
        this.ts = MapContext.getTileSize();
        this.renderingBaseX = RenderingContext.getCanvasWidth(this.canvas) * 0.5 - this.ts;
        this.renderingBaseY = RenderingContext.getCanvasHeight(this.canvas) * 0.5 - this.ts;
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
        else if(mod == 2)
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
        let ts = this.ts;
        let x = this.renderingBaseX;
        let y = this.renderingBaseY;

        let fontSize = this.renderingFontSize;
        let color = this.renderingColor;

        this.renderIcon(x, y, ts, this.selection);

        this.renderPortak(x, y);
        
        renderText(this.ctx, "Play", x - 8, y + ts, color, fontSize);
        renderText(this.ctx, "Options", x - 8, y + ts + ts, color, fontSize);
        renderText(this.ctx, "Credits", x - 8, y + ts + ts + ts, color, fontSize);
    }

    renderPortak(x, y){
        renderText(this.ctx, "PORTAK", x - (this.ts * 2) - (this.ts >> 2), y - this.ts + 10, "DarkRed", 128);
    }

    renderIcon(x, y, ts, selection){
        MenuContext.getUserPlayerIcon().render(x - ts * 1.375, y - 40 + ts + ts * selection);
    }

    renderOptions(){
        let ts = this.ts;
        let x = RenderingContext.getCanvasWidth(this.canvas) * 0.5 - ts;
        let y = RenderingContext.getCanvasHeight(this.canvas) * 0.5 - ts;

        let fontSize = this.renderingFontSize;
        let color = this.renderingColor;

        this.renderPortak(x, y);

        this.renderIcon(x - ts, y, ts, this.selection);

        if(this.mute){
            renderText(this.ctx, "Unmute", x - ts - 8, y + ts, "LightGreen", fontSize);
        } else {
            renderText(this.ctx, "Mute", x - ts - 8, y + ts, "Red", fontSize);
        }

        renderText(this.ctx, "Select player", x - ts - 8, y + ts + ts, color, fontSize);
    }

    renderCredits(){
        let ts = MapContext.getTileSize();
        let x = this.renderingBaseX;
        let y = this.renderingBaseY;

        let fontSize = 42;
        let color = "White";

        this.renderPortak(x, y);
        if(this.selection == 0){
            this.renderCredits1(x, y, ts, fontSize, color);
        } else{
            this.renderCredits2(x, y, ts, fontSize, color);
        }
    }

    renderCredits1(x, y, ts, fontSize, color){
        y += ts * 0.8;
        x = x - ts * 5 - 16;

        renderText(this.ctx, "University   project   game", x, y, color, fontSize);
        y += ts;

        renderText(this.ctx, "By   BENZA   Amandine   and   FORNALI   Damien", x, y, color, fontSize);
        y += ts;

        renderText(this.ctx, "University   of   Nice-Sophia-Antipolis", x, y, color, fontSize);
        y += ts;

        renderText(this.ctx, "Master   I   IFI", x, y, color, fontSize);
        renderText(this.ctx, "2017-2018", x + ts * 9 + 24, y, color, fontSize);

        TextureContext.getArrowDownTexture().render(x + ts * 6 + 8, y + (ts * 0.5));
    }

    renderCredits2(x, y, ts, fontSize, color){
        y += ts * 0.8;
        x = x - ts * 5 - 16 + ts;

        renderText(this.ctx, "Code   and  all  textures  by  us", x, y, color, fontSize);
        y += ts;

        renderText(this.ctx, "Sounds   effects   are   free   to  use", x, y, color, fontSize);
        y += ts;

        renderText(this.ctx, "Background   music   by   Snabisch", x, y, color, fontSize);
        y += ts;

        TextureContext.getArrowUpTexture().render(x - ts + ts * 6 + 8, y + (ts * 0.5));
    }

    renderPlayerSelection(){
        let ts = MapContext.getTileSize();
        let x = 4 * ts + 8;
        let y = 5 * ts + 6;

        let fontSize = this.renderingFontSize;
        let color = this.renderingColor;

        this.renderPortak(this.renderingBaseX, this.renderingBaseY);

        this.renderIconPlayerSelection(x, y, this.selection, ts);

        TextureContext.getNormalPlayerTexture().render(x, y);
        TextureContext.getBluePlayerTexture().render(x + (ts * 2), y);
        TextureContext.getGreenPlayerTexture().render(x + (ts * 4), y);
        TextureContext.getPinkPlayerTexture().render(x + (ts * 6), y);
    }

    renderIconPlayerSelection(x, y, selection, ts){
        MenuContext.getUserPlayerIcon().render(x - 12 + (selection * (ts * 2)) + ts * 0.25 - 4, y + ts + (ts >> 2));
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
                    SoundContext.getMenuSelectionSound().play();
                    SoundContext.enableSoundsNoCheck();
                    this.mute = false;
                } else {
                    SoundContext.getMenuSelectionSound().play();
                    SoundContext.disableSoundsNoCheck();
                    this.mute = true;
                }
            } else if(this.selection == 1){
                SoundContext.getMenuSelectionSound().play();
                this.savedSelection2 = this.savedSelection;
                this.setMod(3);
            }
        } 

        if(isPressed(EventContext.escapeKey()) && this.canSelect){
            this.setMod(0);
        }
    }

    handleCreditsInput(){
        this.optionInput();

        if(isPressed(EventContext.escapeKey()) && this.canSelect){
            this.setMod(0);
        }
    }

    setPlayerSelection(selection){
        let path = "res/textures/player/";
        switch(selection){
            case 0:
                path += "normalPlayer.png";
                break;
            case 1:
                path += "bluePlayer.png";
                break;
            case 2:
                path += "greenPlayer.png";
                break;
            case 3:
                path += "pinkPlayer.png";
                break;
        }

        MenuContext.setUserPlayerSelection(path);
    }

    setPlayerIcon(selection){
        switch(selection){
            case 0:
                MenuContext.setUserPlayerIcon(TextureContext.getNormalPlayerIcon());
                break;
            case 1:
                MenuContext.setUserPlayerIcon(TextureContext.getBluePlayerIcon());
                break;
            case 2:
                MenuContext.setUserPlayerIcon(TextureContext.getGreenPlayerIcon());
                break;
            case 3:
                MenuContext.setUserPlayerIcon(TextureContext.getPinkPlayerIcon());
                break;
        }
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
            this.setPlayerIcon(this.selection);
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