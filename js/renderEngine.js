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
  getPxFontSized : function(){return RenderingContext.getFontSize() + RenderingContext.getPxFont();},
  getPxFont : function(){return "px " + RenderingContext.getFont();},
  getFont : function(){return "arial";},

  getClearBaseX : function(){return 0;},
  getClearBaseY : function(){return 0;},
  getClearWidth : function(canvas){return canvas.width;},
  getClearHeight : function(canvas){return canvas.height;},

  noCursor : function(){return "none";},

  getCanvasWidth : function(canvas){
    return canvas.width;
  },

  getCanvasHeight : function(canvas){
    return canvas.height - RenderingContext.getUIHeight();
  },

  getUIWidth : function(canvas){
    return canvas.width;
  },

  getUIHeight : function(canvas){
    return MapContext.getTileSize(); // << 1
  }
};

function initRendering(ctx, canvas){
  println("Initializing rendering...");
  RenderingContext.init(canvas);
  TextureContext.init(getMainContext(), getMainCanvas());
  println("Rendering: OK.");
}

// global rendering
function render(canvas, world){
  clear(canvas);
  //renderUI(world.getContext(), canvas);
  world.render();
  requestAnimationFrame(run);
}

// render user interface
function renderUI(ctx, canvas){
  let startX = 0;
  let startY = RenderingContext.getCanvasHeight(canvas);
  let width = RenderingContext.getCanvasWidth(canvas);

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(startX + width, startY);
  ctx.stroke();
  ctx.restore();
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

