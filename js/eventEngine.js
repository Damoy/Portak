var keyState = [];
var prevKeyState = [];

// events singleton
var EventContext = {
  initListeners : function(canvas){
    window.onkeydown = keyPressed;
    window.onkeyup = keyReleased;
  },

  // javascript key codes
  jsUpKey : function(){return 'ArrowUp';},
  jsLeftKey : function(){return 'ArrowLeft';},
  jsDownKey : function(){return 'ArrowDown';},
  jsRightKey : function(){return 'ArrowRight';},
  jsSpaceKey : function(){return 'Space';},
  jsResetKey : function(){return 'Enter';},
  jsMusicEnDisablingKey : function(){return 'Semicolon';},
  jsEscapeKey : function(){return 'Escape';},

  // own key code
  upKey : function(){return 0;},
  leftKey : function(){return 1;},
  downKey : function(){return 2;},
  rightKey : function(){return 3;},
  spaceKey : function(){return 4;},
  resetKey : function(){return 5;},
  musicKey : function(){return 6;},
  escapeKey : function(){return 8;},

  getKeyCount : function(){return 8;}
}

function initListeners(canvas){
  println("Initializing event listeners...");
  EventContext.initListeners(canvas);
  println("Event listeners: OK.");
}

// -- Keyboard

function keySet(key, pressed){
    if(key == EventContext.jsUpKey()) keyState[hash(EventContext.upKey())] = pressed;
    else if(key == EventContext.jsLeftKey()) keyState[hash(EventContext.leftKey())] = pressed;
    else if(key == EventContext.jsDownKey()) keyState[hash(EventContext.downKey())] = pressed;
    else if(key == EventContext.jsRightKey()) keyState[hash(EventContext.rightKey())] = pressed;
    else if(key == EventContext.jsSpaceKey()) keyState[hash(EventContext.spaceKey())] = pressed;
    else if(key == EventContext.jsResetKey()) keyState[hash(EventContext.resetKey())] = pressed;
    else if(key == EventContext.jsMusicEnDisablingKey()) keyState[hash(EventContext.musicKey())] = pressed;
    else if(key == EventContext.jsEscapeKey()) keyState[hash(EventContext.escapeKey())] = pressed;
}

function hash(ownKeyCode){
    return ownKeyCode;
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
  return keyState[hash(ownKeyCode)] & !prevKeyState[hash(ownKeyCode)];
}

