/*

  ------ Rendering ------

*/

// rendering singleton
var RenderingContext = {
  init : function(canvas){
    canvas = document.querySelector("#mainCanvas");
    setMainCanvas(canvas);
    setMainContext(canvas.getContext("2d"));
    hideCursor(canvas);
  },

  getFontSize : function(){return MapContext.getTileSize();},
  getPxFontSized : function(){return RenderingContext.getFontSize() + "px tahoma";},
  getPxFont : function(){return "px tahoma";},
  getFont : function(){return "tahoma";},

  getClearBaseX : function(){return 0;},
  getClearBaseY : function(){return 0;},
  getClearWidth : function(canvas){return canvas.width;},
  getClearHeight : function(canvas){return canvas.height;},

  noCursor : function(){return "none";}
};

function initRendering(canvas){
  println("Initializing rendering...");
  RenderingContext.init(canvas);
  println("Rendering: OK.");
}

// global rendering
function render(canvas, world){
  clear(canvas);
  world.render();
  requestAnimationFrame(run);
}

// some info' rendering
function renderInfo(){
}

// end game rendering
function renderEndGame(){
}

// rendering a simple text
function renderText(ctx, text, x, y, color, fontSize){
  ctx.save();
  ctx.font = fontSize + RenderingContext.getPxFont();
  ctx.fillStyle = color;
  ctx.fillText(text, x, y);
  ctx.restore();
}

// rendering a composed text
function renderComposedText(ctx, title, data, x, xoffset, y, yoffset, color) {
  ctx.save();
  ctx.font = RenderingContext.getPxFontSized();
  ctx.fillStyle = color;
  ctx.fillText(title, x, y);
  ctx.fillText(data, x + xoffset, y + yoffset);
  ctx.restore();
}

function hideCursor(canvas){
   canvas.style.cursor = RenderingContext.noCursor();
}

function clear(canvas){
  ctx.clearRect(RenderingContext.getClearBaseX(), RenderingContext.getClearBaseY(),
    RenderingContext.getClearWidth(canvas), RenderingContext.getClearHeight(canvas));
}

