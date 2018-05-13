var sounds = [];
var maxSoundId = 0;
var wallHitSound = null;
var musicEnable = true;
var musicEnableCounter = null;
var canEnable = true;
var bgPlayBackSpeedBaseValue = 0.7;
var bgPlayBackSpeed = bgPlayBackSpeedBaseValue;
var currentBgMusic = null;
var musicEnableChecker = null;
var bgMusicBaseVolume = 0.2;

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
            musicEnableChecker = new TickCounter(120);
            println("Can enable music !");
        }

        if(musicEnableChecker != null){
            musicEnableChecker.update();
            if(musicEnableChecker.isStopped()){
                if(currentBgMusic == null || !currentBgMusic.isActive()){
                    SoundContext.getBackgroundMusic().play();
                }
                musicEnableChecker = null;
            }
        }
    },

    pressSoundButton(){
        if(SoundContext.isMusicMute())
            SoundContext.enableSounds();
        else
            SoundContext.disableSounds();
    },

    pressEndGameSoundButton(){
        if(SoundContext.isMusicMute())
            SoundContext.enableSoundsEndGame();
        else 
            SoundContext.disableSounds();
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

    getEndGameMusic(){
        return SoundContext.load("res/sounds/endgame.mp3").setVolume(0.3);
    },

    getBackgroundMusic(){
        if(currentBgMusic != null && currentBgMusic.isActive()){
            return currentBgMusic;
        } else if(currentBgMusic != null && !currentBgMusic.isActive()){
            currentBgMusic.reset();
            return currentBgMusic;
        } else if(currentBgMusic == null){
            currentBgMusic = SoundContext.load("res/sounds/main.mp3").setSpeed(bgPlayBackSpeed).setVolume(bgMusicBaseVolume);
            return currentBgMusic;
        }
    },

    resetBackgroundMusic(){
        if(currentBgMusic != null){
            currentBgMusic.setSpeed(bgPlayBackSpeed).setVolume(bgMusicBaseVolume);
        }
    },

    stopAll(){
        sounds.forEach((sound) => {
            sound.stop();
        });
    },

    accelerateBackgroundMusic(){
        if(currentBgMusic == null) return;
        currentBgMusic.increaseSpeed(0.1);
    },

    deaccelerateBackgroundMusic(){
        if(currentBgMusic == null) return;
        currentBgMusic.increaseSpeed(-0.1);
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

    enableSoundsEndGame(){
        if(!canEnable) return;
        musicEnable = true;
        musicEnableCounter = new TickCounter(60);
        canEnable = false;
        SoundContext.getEndGameMusic().play();
    },

    disableSounds(){
        if(!canEnable) return;
        musicEnable = false;
        musicEnableCounter = new TickCounter(60);
        canEnable = false;

        sounds.forEach((sound) => {
            sound.stop();
        });
    },

    enableSoundsNoCheck(){
        musicEnable = true;
    },

    disableSoundsNoCheck(){
        musicEnable = false;
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
    }

    setVolume(volume){
        this.audio.volume = volume;
        return this;
    }

    increaseVolume(dv){
        this.audio.volume += dv;
        return this;
    }

    increaseSpeed(ds){
        this.audio.playbackRate += ds;
        return this;  
    }

    setSpeed(speed){
        this.audio.playbackRate = speed;
        return this;
    }

    isActive(){
        return !this.audio.paused;
    }

    reset(){
        this.stop();
        this.audio.currentTime = 0;
        return this;
    }

    getId(){return this.id;}
    getPath(){return this.path;}
}