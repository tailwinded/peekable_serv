/* Author: YOUR NAME HERE
*/

/*counter = 0;
my_i = 1;
scale = 1;
volume = 0;
// Create a rectangle shaped path with its top left point at
// {x: 75, y: 75} and a size of {width: 75, height: 75}
var topLeft = new Point(175, 175);
var size = new Size(175, 175);
var path = new Path.Rectangle(topLeft, size);

path.strokeColor = 'blue';

function onFrame(event) {
    // Each frame, rotate the path by 3 degrees:
    volume = (volume==0) ? 0.001 : volume;

    path.scale(volume/scale);
    scale = volume;

    if (volume > 0.2) {
      path.strokeColor = 'blue';
    } else {
      path.strokeColor = 'red';
    }


    path.rotate(0.5);
}*/

mycanvas = document.getElementById('canvas-1');
context = mycanvas.getContext('2d');
 
numBalls = 8;
spring = 0.45;
gravity = 4.5;
friction = -0.9;
surfaceFriction = 0.96;
dragRatio = 0.06;
throwRatio = 0.2;
prevX = 0;
prevY = 0;
prevBX = 0;
prevBY = 0;
prevBBX = 0;
prevBBY = 0;
clickDistanceX = 0;
clickDistanceY = 0;
 
selectedBall = -1;

volume = 0;
volume_bounce = 50; // <-- CHANGE THIS TO INCREASE BOUNCE

freqs = [];

ballarray = new Array(numBalls);
 
function ball(bx, by, bsize, bid, bcolour) {
  this.size = bsize;
  this.id = bid;
  this.x = bx;
  this.y = by;
  this.vx = 0;
  this.vy = 0;
  this.colour = bcolour;
}
 
 
function draw_ball(ball) {
  context.strokeStyle = "#000000";
  context.fillStyle = ball.colour;
  context.beginPath();
  context.arc(ball.x,ball.y,ball.size,0,Math.PI*2,true);
  context.closePath();
  //context.stroke();
  context.fill();
  //context.drawImage(img_pumpkin, ball.x-ball.size,ball.y-ball.size,ball.size*2, ball.size*2);
  
}
 
function move_ball(ball) {
  if (ball.id != selectedBall) {
    ball.vy += gravity;
      ball.x += ball.vx;
      ball.y += ball.vy;
      if (ball.x + ball.size >= mycanvas.width) {
      ball.x = mycanvas.width - ball.size;
      ball.vx *= friction + (ball.size/500); 
      }
      else if (ball.x - ball.size < 0) {
      ball.x = ball.size;
      ball.vx *= friction + (ball.size/500);
      }
      if (ball.y + ball.size >= mycanvas.height) {
      ball.y = mycanvas.height - ball.size;
      ball.vy *= friction + (ball.size/500);
      
      ball.vx *= surfaceFriction; 
      } 
    else if (ball.y - ball.size < 0) {
      ball.y = ball.size;
      ball.vy *= friction + (ball.size/500);
      
      ball.vx *= surfaceFriction; 
      }
    }
}
 
function collide_ball(ball) {
  for (var i = ball.id + 1; i < numBalls; i++) {
    var dx = ballarray[i].x - ball.x;
    var dy = ballarray[i].y - ball.y;
    var distance = Math.sqrt(dx*dx + dy*dy);
    var minDist = ballarray[i].size + ball.size;
    if (distance < minDist) { 
      var angle = Math.atan2(dy, dx);
        
      var targetX = ball.x + Math.cos(angle) * minDist;
      var targetY = ball.y + Math.sin(angle) * minDist;
        
      var ax = (targetX - ballarray[i].x) * spring;
      var ay = (targetY - ballarray[i].y) * spring;
      
      var proportions = Math.sqrt(ballarray[i].size) / Math.sqrt(ball.size);
      
      ball.vx -= ax * proportions;
      ball.vy -= ay * proportions;
      ballarray[i].vx += ax * (1/proportions);
      ballarray[i].vy += ay * (1/proportions);
    }
  }   
}
 
function drag_windows() {
  var curX = window.screenX || window.screenLeft || 0;
  var curY = window.screenY || window.screenTop || 0;
  
  if (curX > 0) {
    if (prevX - curX != 0 || prevY - curY != 0) {
      for (var i=0; i < numBalls; i++) {
        ballarray[i].vx += dragRatio * (prevX - curX);
        ballarray[i].vy += dragRatio * (prevY - curY);
      }
      prevX = curX;
      prevY = curY;
    }
  }
}
 
 
function draw_frame() {
  context.fillStyle = "rgb(225,225,225)";
  context.fillRect(0, 0, mycanvas.width, mycanvas.height);
  
  drag_windows();
  
  for (var i=0; i < numBalls; i++) {
    ballarray[i].colour = "rgb("+Math.floor(i*30 + (freqs[i*2+1]*5000))+","+Math.floor(i*20 + (freqs[i*2+1]*4500))+","+Math.floor(i*20 + (freqs[i*2+1]*3500))+")";
    ballarray[i].y -= freqs[i*2]/200;
    //if (freqs[i*2+1] > 0.005) ballarray[i].y = mycanvas.height;
    //console.log("rgb("+Math.floor(i*30 + (freqs[i*2+1]*2200))+","+Math.floor(i*20 + (freqs[i*2+1]*1500))+","+Math.floor(i*20 + (freqs[i*2+1]*1500))+")");
    ballarray[i]
    collide_ball(ballarray[i]);
    move_ball(ballarray[i]);
    draw_ball(ballarray[i]);
  }

  volume = Math.round(volume/2);
  
  if (selectedBall != -1) {
    prevBBX = prevBX;
    prevBBY = prevBY;
    prevBX = ballarray[selectedBall].x;
    prevBY = ballarray[selectedBall].y;
  }
}
 
function inverse_gravity() {
  gravity = -gravity;
}
 
function resize_canvas() {
  mycanvas.width = window.innerWidth;
  mycanvas.height = window.innerHeight;
}
 
function init() {
  resize_canvas();
  
  prevX = window.screenX || window.screenLeft || 0;
  prevY = window.screenY || window.screenTop || 0;
  
  for (var i=0; i < numBalls; i++) {
    randsize = 30 + Math.floor(Math.random()*60);
    randx = Math.floor(Math.random()*(mycanvas.width-randsize));
    randy = Math.floor(Math.random()*(mycanvas.height-randsize));
    colour = "rgb(" + Math.floor(Math.random()*255) + "," + Math.floor(Math.random()*255) + "," + Math.floor(Math.random()*255) + ")";
    ballarray[i] = new ball(randx,randy,randsize,i,colour);
  }
 
  setInterval(draw_frame, 60);
  
  $(window).resize(function() {
    resize_canvas();
  });
  
  $(window).mousedown(function(event) {
    for (var i=0; i < numBalls; i++) {
      var dx = ballarray[i].x - event.clientX;
      var dy = ballarray[i].y - event.clientY;
      var distance = Math.sqrt(dx*dx + dy*dy);
      
      if (distance <= ballarray[i].size) {
        selectedBall = i;
        
        prevBX = ballarray[i].x;
        prevBY = ballarray[i].x;
        
        ballarray[i].vx = ballarray[i].vy = 0;
        
        clickDistanceX = ballarray[i].x - event.clientX;
        clickDistanceY = ballarray[i].y - event.clientY;
        break;
      }
    }
    
    
  });
  
  $(window).mouseup(function(event) {
    ballarray[selectedBall].vx = (ballarray[selectedBall].x - prevBBX) * throwRatio;
    ballarray[selectedBall].vy = (ballarray[selectedBall].y - prevBBY) * throwRatio;
    
    selectedBall = -1;
  });
  
  $(window).mousemove(function(event) {
    if (selectedBall != -1) {
      ballarray[selectedBall].x = event.clientX + clickDistanceX;
      ballarray[selectedBall].y = event.clientY + clickDistanceY;
    }
  });

  mycanvas.addEventListener("touchstart", touchStart, false);
  mycanvas.addEventListener("touchmove", touchMove, false);
  mycanvas.addEventListener("touchend", touchEnd, false)
  mycanvas.addEventListener("onorientationchange", resize_canvas, false);
  
}

function touchStart(event) {
  event.preventDefault();
  for (var i=0; i < numBalls; i++) {
    var dx = ballarray[i].x - event.touches[0].pageX;
    var dy = ballarray[i].y - event.touches[0].pageY;
    var distance = Math.sqrt(dx*dx + dy*dy);
    
    if (distance <= ballarray[i].size) {
      selectedBall = i;
      
      prevBX = ballarray[i].x;
      prevBY = ballarray[i].x;
      
      ballarray[i].vx = ballarray[i].vy = 0;
      
      clickDistanceX = ballarray[i].x - event.touches[0].pageX;
      clickDistanceY = ballarray[i].y - event.touches[0].pageY;
      break;
    }
  }
}

function touchMove(event) {
  event.preventDefault();
  if (selectedBall != -1) {
    ballarray[selectedBall].x = event.touches[0].pageX + clickDistanceX;
    ballarray[selectedBall].y = event.touches[0].pageY + clickDistanceY;
  }
}

function touchEnd(event) {
  event.preventDefault();
  ballarray[selectedBall].vx = (ballarray[selectedBall].x - prevBBX) * throwRatio;
  ballarray[selectedBall].vy = (ballarray[selectedBall].y - prevBBY) * throwRatio;
  
  selectedBall = -1;
}

$(function() { init(); })