var mousePos = {x:0, y:0};
var keyState = [];
var prevKeyState = [];

// events singleton
var EventContext = {
  initListeners : function(canvas){
    window.onkeydown = keyPressed;
    window.onkeyup = keyReleased;

    canvas.addEventListener('mousemove', function (evt) {
      mousePos = getMousePos(canvas, evt);
    }, false); 
  },

  getMousePos : function(){return mousePos;},

  // javascript key codes
  jsUpKey : function(){return 'ArrowUp';},
  jsLeftKey : function(){return 'ArrowLeft';},
  jsDownKey : function(){return 'ArrowDown';},
  jsRightKey : function(){return 'ArrowRight';},
  jsSpaceKey : function(){return 'Space';},
  jsResetKey : function(){return 'Enter';},

  // own key code
  upKey : function(){return 0;},
  leftKey : function(){return 1;},
  downKey : function(){return 2;},
  rightKey : function(){return 3;},
  spaceKey : function(){return 4;},
  resetKey : function(){return 5;},

  getKeyCount : function(){return 6;}
}

function initListeners(canvas){
  println("Initializing event listeners...");
  EventContext.initListeners(canvas);
  println("Event listeners: OK.");
}

// -- Keyboard

function keySet(key, pressed){
    if(key == EventContext.jsUpKey()) keyState[EventContext.upKey()] = pressed;
    else if(key == EventContext.jsLeftKey()) keyState[EventContext.leftKey()] = pressed;
    else if(key == EventContext.jsDownKey()) keyState[EventContext.downKey()] = pressed;
    else if(key == EventContext.jsRightKey()) keyState[EventContext.rightKey()] = pressed;
    else if(key == EventContext.jsSpaceKey()) keyState[EventContext.spaceKey()] = pressed;
    else if(key == EventContext.jsResetKey()) keyState[EventContext.resetKey()] = pressed;
}

function keyPressed(evt){
  keySet(evt.code, true);
}

function keyReleased(evt) {
  keySet(evt.code, false);
}

function updateKeyEvents(){
  for(let i = 0; i < EventContext.getKeyCount(); ++i)
    prevKeyState[i] = keyState[i];
}

function isPressed(ownKeyCode){
  return keyState[ownKeyCode] & !prevKeyState[ownKeyCode];
}

// -- Mouse

function mouseMoved(evt){
}

function getMousePos(canvas, evt) {
  // necessary to take into account CSS boundaries
  let bcr = canvas.getBoundingClientRect();
  return {
     x: evt.clientX - bcr.left,
     y: evt.clientY - bcr.top
   }
};
