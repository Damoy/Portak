var mainFont = "serif";

// rendering singleton
var RenderingContext = {
  init : function(canvas){
    canvas = document.querySelector("#mainCanvas");
    setMainCanvas(canvas);
    setMainContext(canvas.getContext("2d"));
    hideCursor(canvas);
    changeFavicon("res/textures/icons/normalPlayerIcon.png");
    changeFont("ARCADECLASSIC");
  },

  getFont : function(){return mainFont;},

  getClearBaseX : function(){return 0;},
  getClearBaseY : function(){return 0;},
  getClearWidth : function(canvas){return canvas.width;},
  getClearHeight : function(canvas){return canvas.height;},

  noCursor : function(){return "none";},

  getCanvasWidth : function(canvas){
    return canvas.width - RenderingContext.getUIWidth();
  },

  getCanvasHeight : function(canvas){
    return canvas.height - RenderingContext.getUIHeight();
  },

  getUIWidth : function(canvas){
    return 0;
  },

  getUIHeight : function(canvas){
    return 0;
  }
};

function initRendering(ctx, canvas){
  println("Initializing rendering...");
  RenderingContext.init(canvas);
  TextureContext.init(getMainContext(), getMainCanvas());
  println("Rendering: OK.");
}

// global rendering
function render(world){
  world.render();
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

// rendering a simple text
function renderText(ctx, text, x, y, color, fontSize){
  ctx.save();
  ctx.font = fontSize + "px " + RenderingContext.getFont();
  ctx.fillStyle = color;
  ctx.fillText(text, x, y);
  ctx.restore();
}

function hideCursor(canvas){
   canvas.style.cursor = RenderingContext.noCursor();
}

function clear(canvas){
  ctx.clearRect(RenderingContext.getClearBaseX(), RenderingContext.getClearBaseY(),
    RenderingContext.getClearWidth(canvas), RenderingContext.getClearHeight(canvas));
}

document.head = document.head || document.getElementsByTagName('head')[0];

function changeFavicon(src) {
	var link = document.createElement('link'),
	oldLink = document.getElementById('dynamic-favicon');
	
	link.id = 'dynamic-favicon';
	link.rel = 'shortcut icon';
	link.href = src;

	if (oldLink) {
		document.head.removeChild(oldLink);
	}

	document.head.appendChild(link);
}

function changeFont(font){
  mainFont = font;
  println("Font used: " + font + ".");
}

