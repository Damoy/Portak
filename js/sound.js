var sounds = [];
var maxSoundId = 0;
var wallHitSound = null;
var musicEnable = true;
var musicEnableCounter = null;
var canEnable = true;

var SoundContext = {
    init(){
        // a shared variable to avoid to polluate audio
        // with wall collision sound
        wallHitSound = SoundContext.load("res/sounds/wallHit.wav");
    },

    update(){
        if(musicEnableCounter == null){
            return;
        }

        musicEnableCounter.update();

        if(musicEnableCounter.isStopped()){
            musicEnableCounter = null;
            canEnable = true;
            println("Can enable music !");
        }

    },

    pressSoundButton(){
        if(SoundContext.isMusicMute())
            SoundContext.enableSounds();
        else SoundContext.disableSounds();
    },

    load(path){
        var sound = new Sound(maxSoundId++, path);
        sounds.push(sound);
        return sound;
    },

    play(id){
        sounds[id].play();
    },

    getDoorOpeningSound(){
        return SoundContext.load("res/sounds/doorOpen.wav");
    },

    getHitSound(){
        return SoundContext.load("res/sounds/hit.wav");
    },

    getPowerupSound(){
        return SoundContext.load("res/sounds/powerup.wav");
    },

    getDeathSound(){
        return SoundContext.load("res/sounds/death.wav");
    },

    getWallHitSound(){
        return wallHitSound;
    },

    getPortalSound(){
        return SoundContext.load("res/sounds/portal.wav");
    },

    getBackgroundMusic(){
        return SoundContext.load("res/sounds/main.mp3");
    },

    getMenuOptionSound(){
        return SoundContext.load("res/sounds/menuOption.wav");
    },

    getMenuSelectionSound(){
        return SoundContext.load("res/sounds/menuSelection.wav");
    },

    isMusicMute(){
        return !musicEnable;
    },

    enableSounds(){
        if(!canEnable) return;
        musicEnable = true;
        musicEnableCounter = new TickCounter(60);
        canEnable = false;
        SoundContext.getBackgroundMusic().play();
    },

    disableSounds(){
        if(!canEnable) return;
        musicEnable = false;
        musicEnableCounter = new TickCounter(60);
        canEnable = false;

        sounds.forEach((sound) => {
            sound.stop();
        });
    }
}

class Sound{
    constructor(id, path){
        this.id = id;
        this.path = path;
        this.audio = new Audio(this.path);
    }

    play(){
        if(SoundContext.isMusicMute()) return;
        this.audio.play();
    }

    stop(){
        this.audio.pause();
        this.audio.currentTime = 0;
    }

    getId(){return this.id;}
    getPath(){return this.path;}
}