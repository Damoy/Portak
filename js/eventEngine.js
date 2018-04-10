var mousePos = {x:0, y:0};

// events singleton
var EventContext = {
  initListeners : function(canvas){
    window.onkeydown = keyPressed;
    window.onkeyup = keyReleased;

    canvas.addEventListener('mousemove', function (evt) {
      mousePos = getMousePos(canvas, evt);
    }, false); 
  },

  getMousePos : function(){return mousePos;}
}

function initListeners(canvas){
  println("Initializing event listeners...");
  EventContext.initListeners(canvas);
  println("Event listeners: OK.");
}

// -- Keyboard

function keyPressed(evt) {
  let player = WorldContext.getMainPlayer();
  switch(evt.code) {
    case 'ArrowRight':
      player.changeDirection(PlayerContext.getRightDirValue());
      // player.setSpeedX(player.getMaxSpeed());
      break;
    case 'ArrowLeft':
      player.changeDirection(PlayerContext.getLeftDirValue());
      // player.setSpeedX(-player.getMaxSpeed());
      break;
    case 'ArrowUp':
      player.changeDirection(PlayerContext.getUpDirValue());
      // player.setSpeedY(-player.getMaxSpeed());
      break;
    case 'ArrowDown':
      player.changeDirection(PlayerContext.getDownDirValue());
      // player.setSpeedY(player.getMaxSpeed());
      break;
  }
}

function keyReleased(evt) {
  let player = WorldContext.getMainPlayer();
  switch(evt.code) {
    case 'ArrowRight':
    case 'ArrowLeft':
      // player.changeDirection(PlayerContext.getNoneDirValue());
      player.stop();
      break;
    case 'ArrowUp':
    case 'ArrowDown':
      // player.changeDirection(PlayerContext.getNoneDirValue());
      player.stop();
      break;
  }
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
