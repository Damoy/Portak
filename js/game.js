// static fields
window.onload = main;
var canvas;
var ctx;
var world;
var mainMenu;
var bgMusicCounter;

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
  // build the main menu
  buildMenu();
  requestAnimationFrame(run);
}

function initWorld(){
  world = new World(ctx, canvas);
}

function buildMenu(){
  mainMenu = new Menu(ctx, canvas, world);
}

function start(){
  mainMenu = null;
  bgMusicCounter = new TickCounter(40 * 60);
  SoundContext.getBackgroundMusic().play();
  world.start();
}

/*

  ------ Gameloop ------

*/

function run() {
   update();
   clear(canvas);

   if(mainMenu != null){
     mainMenu.render();
   } else {
     render(world);
   }

   requestAnimationFrame(run);
}

function update(){
  if(mainMenu != null){
    mainMenu.update();
  } else {
    bgMusicCounter.update();
    if(bgMusicCounter.isStopped()){
      bgMusicCounter.reset();
      SoundContext.getBackgroundMusic().play();
    }
    world.update();
  }

  SoundContext.update();
}