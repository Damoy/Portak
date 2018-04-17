// static fields
window.onload = main;
var canvas;
var ctx;
var world;

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
  // init the world
  initWorld(ctx, canvas);
  // start the gameloop
  start();
}

function initWorld(){
  world = new World(ctx, canvas);
  // LevelLoadingContext.loadLevel(ctx, canvas, "res/textures/redCube.png", 64, 64);
}

function start(){
  requestAnimationFrame(run);
}

/*

  ------ Gameloop ------

*/

function run() {
   update();
   render(canvas, world);
}

// TODO delta time
function update(){
  let mousePos = EventContext.getMousePos();
  world.update();
  // println("Mouse x: " + mousePos.x + ", y: " + mousePos.y);
}