// static fields
window.onload = main;
var canvas;
var ctx;
var world;
var bgMusicCounter = null;

function setMainCanvas(cvn){
  canvas = cvn;
}

function setMainContext(context){
  ctx = context;
}

function setMainWorld(wld){
  world = wld;
}

function getMainCanvas(){return canvas;}
function getMainContext(){return ctx;}
function getMainWorld(){return world;}

/*

  ------ Initialisation ------

*/

function main() {
  println("Game generation...");
  // renderEngine
  initRendering(ctx, canvas);
  // eventEngine
  initListeners(canvas);
  // sound engine
  SoundContext.init();
  // init the world
  initWorld(ctx, canvas);
  // start the gameloop
  start();
}

function initWorld(){
  world = new World(ctx, canvas);
  world.start();
}

function start(){
  bgMusicCounter = new TickCounter(39 * 60);
  SoundContext.getBackgroundMusic().play();
  requestAnimationFrame(run);
}

/*

  ------ Gameloop ------

*/

function run() {
   update();
   render(canvas, world);
}

function update(){
  bgMusicCounter.tick();
  if(bgMusicCounter.isStopped()){
    bgMusicCounter.reset();
    SoundContext.getBackgroundMusic().play();
  }
  world.update();
  SoundContext.update();
}