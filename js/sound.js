var sounds = [];
var maxSoundId = 0;
var wallHitSound = null;
var musicEnable = true;
var musicEnableCounter = null;
var canEnable = true;

var SoundContext = {
    init(){
        wallHitSound = SoundContext.load("res/sounds/wall_hit.wav");
    },

    update(){
        if(musicEnableCounter == null){
            return;
        }

        musicEnableCounter.tick();

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
        return SoundContext.load("res/sounds/door_open.wav");
    },

    getHitSound(){
        return SoundContext.load("res/sounds/hit.wav");
    },

    getPowerupSound(){
        return SoundContext.load("res/sounds/powerup.wav");
    },

    getDeathSound(){
        return SoundContext.load("res/sounds/deathh.wav");
    },

    getWallHitSound(){
        return wallHitSound;
    },

    getPortalSound(){
        return SoundContext.load("res/sounds/Portal.wav");
    },

    getBackgroundMusic(){
        return SoundContext.load("res/sounds/background.mp3");
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