var sounds = [];
var maxSoundId = 0;

var SoundContext = {
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
    }
}

class Sound{
    constructor(id, path){
        this.id = id;
        this.path = path;
        this.audio = new Audio(this.path);
    }

    play(){
        this.audio.play();
    }

    getId(){return this.id;}
    getPath(){return this.path;}
}