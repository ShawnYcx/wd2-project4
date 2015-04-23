// disabling the right click and F12 to prevent users from inspecting element and messing around with things
// we cannot prevent users from using development tools to mess with the page though... It's OK

var socket = io();
//Game Logic 
window.oncontextmenu = function () {
   return false;
}
document.onkeydown = function (e) { 
    if (window.event.keyCode == 123 ||  e.button==2)    
    return false;
}

// RequestAnimFrame
window.requestAnimFrame = (function(){
	return  window.requestAnimationFrame       || 
		window.webkitRequestAnimationFrame || 
		window.mozRequestAnimationFrame    || 
		window.oRequestAnimationFrame      || 
		window.msRequestAnimationFrame     ||  
		function( callback ){
			return window.setTimeout(callback, 1000 / 60);
		};
})();

window.cancelRequestAnimFrame = ( function() {
	return window.cancelAnimationFrame          ||
		window.webkitCancelRequestAnimationFrame    ||
		window.mozCancelRequestAnimationFrame       ||
		window.oCancelRequestAnimationFrame     ||
		window.msCancelRequestAnimationFrame        ||
		clearTimeout
})();


// Initialize canvas and required variables
var canvas = document.getElementById("canvas"),
	ctx = canvas.getContext("2d"), // Create canvas context
	W = window.innerWidth, // Window's width
	H = window.innerHeight, // Window's height
	particles = [], // Array containing particles
	ball = {}, // Ball object
	paddles = [2], // Array containing two paddles
	mouse = {}, // Mouse object to store it's current position
	mouse2 = {}, // Second mouse coords
	points = 0, // Varialbe to store points
	pointsP2 = 0, // Player 2 score counter
	fps = 60, // Max FPS (frames per second)
	particlesCount = 40, // Number of sparks when ball strikes the paddle
	flag = 0, // Flag variable which is changed on collision
	particlePos = {}, // Object to contain the position of collision 
	multipler = 1, // Varialbe to control the direction of sparks
	startBtn = {}, // Start button object
	restartBtn = {}, // Restart button object
	exitBtn = {}, // Exit button object
	over = 0, // flag varialbe, cahnged when the game is over
	init, // variable to initialize animation
	paddleHit;

// Add mousemove and mousedown events to the canvas
canvas.addEventListener("mousemove", trackPosition, true);
canvas.addEventListener("mousedown", btnClick, true);

// Initialise the collision sound
collision = document.getElementById("collide");

// Set the canvas's height and width to full screen
canvas.width = W;
canvas.height = H;

// Function to paint canvas
function paintCanvas() {
	ctx.strokeStyle = "black";
	ctx.fillStyle = "white";
	ctx.fillRect(0, 0, W, H);
}

// Function for creating paddles
function Paddle(pos) {
	// Height and width
	this.h = 10;
	this.w = 175;
	
	// Paddle's position
	this.x = W/2 - this.w/2;
	this.y = (pos == "top") ? 0 : H - this.h;
	
}

// Push two new paddles into the paddles[] array
paddles.push(new Paddle("bottom"));
paddles.push(new Paddle("top"));

// Ball object
//Created an array in which to store starting paths for the ball
var half_width = W/2
var half_height = H/2
var velocity_array = [-8,-6,-5-4,-3,3,4,5,6,8];
var rand_velo_x = velocity_array[Math.floor(Math.random() * velocity_array.length)];
var rand_velo_y = velocity_array[Math.floor(Math.random() * velocity_array.length)];
ball = {
	x: half_width,
	y: half_height, 
	r: 7,
	c: "black",
	vx: rand_velo_x,
	vy: rand_velo_y,
	
	// Function for drawing ball on canvas
	draw: function() {
		ctx.beginPath();
		ctx.fillStyle = this.c;
		ctx.arc(this.x, this.y, this.r, 0, Math.PI*2, false);
		ctx.fill();
	}
};


// Start Button object; changed to be just an alert really
startBtn = {
	w: 200,
	h:80,
	x: W/2 - 100,
	y: H/2 - 40,
	
	draw: function() {
		ctx.strokeStyle = "green";
		ctx.lineWidth = "3";
		ctx.strokeRect(this.x, this.y, this.w, this.h);
		
		ctx.font = "32px Arial, sans-serif";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillStlye = "green";
		ctx.fillText("FIGHT!", half_width, half_height);
	}
};

// Restart Button object
restartBtn = {
	w: 100,
	h: 50,
	x: W/2 - 130,
	y: H/2 - 50,
	
	draw: function() {
		ctx.strokeStyle = "green";
		ctx.lineWidth = "2";
		ctx.strokeRect(this.x, this.y, this.w, this.h);
		
		ctx.font = "18px Arial, sans-serif";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillStlye = "white";
		ctx.fillText("AGAIN!", W/2 - 80, H/2 - 25 );
	}
};

// Exit Button object
exitBtn = {
	w: 100,
	h: 50,
	x: W/2 + 50,
	y: H/2 - 50,
	
	draw: function() {
		ctx.strokeStyle = "green";
		ctx.lineWidth = "2";
		ctx.strokeRect(this.x, this.y, this.w, this.h);
		
		ctx.font = "18px Arial, sans-serif";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillStlye = "white";
		ctx.fillText("QUIT!", W/2+100, H/2 - 25 );
	}
};

// Function for creating particles object
function createParticles(x, y, m) {
	this.x = x || 0;
	this.y = y || 0;
	
	this.radius = 1.2;
	
	this.vx = -1.5 + Math.random()*3;
	this.vy = m * Math.random()*1.5;
}

// Draw everything on canvas
function draw() {
	paintCanvas();
	for(var i = 0; i < paddles.length; i++) {
		p = paddles[i];
		
		ctx.fillStyle = "green";
		ctx.fillRect(p.x, p.y, p.w, p.h);
	}


	
	ball.draw();
	update();
}

// Function to increase speed after every 5 points
//Makes the game not fun...
/*function increaseSpd() {
	if(points % 4 == 0) {
		if(Math.abs(ball.vx) < 15) {
			ball.vx += (ball.vx < 0) ? -1 : 1;
			ball.vy += (ball.vy < 0) ? -2 : 2;
		}
	}
}*/

// Track the position of mouse cursor
function trackPosition(e) {
	// mouse.x = e.pageX;
	// mouse.y = e.pageY;

	var ms = {
		x: e.pageX,
		y: e.pageY
	};
	var ms2 ={
		x: e.pageX,
		y: e.pageY
	};
	socket.emit('getPos', ms);
	socket.emit('getPos2', ms2);
	console.log("Tracking")
	// mouse2.x = e.pageX;
	// mouse2.y = e.pageY;

}
//Returns postion of mouse from server
socket.on('returnPos', function(ms){
	mouse.x = ms.x;
	mouse.y = ms.y;
});
socket.on('returnPos2', function(ms2){
	mouse2.x = ms2.x;
	mouse2.y = ms2.y;
});

// Function to update positions, score and everything.
// Basically, the main game logic is defined here
function update() {
	
	
	// Update scores
	updateScore(); 
	updateScore2();

	//SEPERATING PADDLES
	//We can manipluate which inputs go to which paddle using this FOR Loop
	// #0 in paddle array = nothing, #1 in paddle array = Player1, #2 in paddle array= Player2
	if(mouse.x && mouse.y || mouse2.x && mouse2.y) {
		for(var i = 1; i < paddles.length;i++) {
			paddle_player1 = paddles[1]; //By changing the number, we access a different paddle stored in the paddle array
			paddle_player1.x = mouse.x - paddle_player1.w/2;
			//paddle_player2 = paddles[2]; //UNCOMMENT ME WHEN YOU FIGURE IT OUT
			//paddle_player2.x = mouse2.x - paddle_player2.w/2;

		}		
	}
	
	// Move the ball
	ball.x += ball.vx;
	ball.y += ball.vy;
	
	// Collision with paddles
	p1 = paddles[1];
	p2 = paddles[2];
	
	// If the ball strikes with paddles,
	// invert the y-velocity vector of ball,
	// increment the points, play the collision sound,
	// save collision's position so that sparks can be
	// emitted from that position, set the flag variable,
	// and change the multiplier
	if(collides(ball, p1)) {
		collideAction(ball, p1);
	}
	
	
	else if(collides(ball, p2)) {
		collideAction(ball, p2);
	} 
	
	else {
		// Collide with walls, If the ball hits the top/bottom,
		// walls, run gameOver() function
		if(ball.y + ball.r > H) {
			ball.y = H - ball.r;
			pointsP2++;
			if (pointsP2 == 7) {
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				gameOver();
			}
			else {
				startagain();
			}
		} 
		
		else if(ball.y < 0) {
			ball.y = ball.r;
			points++;
			if (points == 7) {
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				gameOver();
			}
			else {
				startagain();
			}
		}
		
		// If ball strikes the vertical walls, invert the 
		// x-velocity vector of ball
		if(ball.x + ball.r > W) {
			ball.vx = -ball.vx;
			ball.x = W - ball.r;
		}
		
		else if(ball.x -ball.r < 0) {
			ball.vx = -ball.vx;
			ball.x = ball.r;
		}
	}
	
	
	
	// If flag is set, push the particles
	if(flag == 1) { 
		for(var k = 0; k < particlesCount; k++) {
			particles.push(new createParticles(particlePos.x, particlePos.y, multiplier));
		}
	}	
	
	// Emit particles/sparks
	emitParticles();
	
	// reset flag
	flag = 0;
}

//Function to check collision between ball and one of
//the paddles
function collides(b, p) { //b = ball collision, p = paddle collision
	if(b.x + ball.r >= p.x && b.x - ball.r <=p.x + p.w) {
		if(b.y >= (p.y - p.h) && p.y > 0){
			paddleHit = 1;
			return true;
		}
		
		else if(b.y <= p.h && p.y == 0) {
			paddleHit = 2;
			return true;
		}
		
		else return false;
	}
}

//Do this when collides == true
function collideAction(ball, p) {
	ball.vy = -ball.vy;
	
	if(paddleHit == 1) {
		ball.y = p.y - p.h;
		particlePos.y = ball.y + ball.r;
		multiplier = -1;	
	}
	
	else if(paddleHit == 2) {
		ball.y = p.h + ball.r;
		particlePos.y = ball.y - ball.r;
		multiplier = 1;	
	}
	
	//increaseSpd();
	
	if(collision) {
		if(points > 0) 
			collision.pause();
		
		collision.currentTime = 0;
		collision.play();
	}
	
	particlePos.x = ball.x;
	flag = 1;
}

// Function for emitting particles after collision
function emitParticles() { 
	for(var j = 0; j < particles.length; j++) {
		par = particles[j];
		
		ctx.beginPath(); 
		ctx.fillStyle = "black";
		if (par.radius > 0) {
			ctx.arc(par.x, par.y, par.radius, 0, Math.PI*2, false);
		}
		ctx.fill();	 
		
		par.x += par.vx; 
		par.y += par.vy; 
		
		// Reduce radius so that the particles die after a few seconds
		par.radius = Math.max(par.radius - 0.05, 0.0); 
		
	} 
}

// Function for updating score
function updateScore() {
	ctx.fillStlye = "";
	ctx.font = "20px Arial, sans-serif";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("P1: " + points, 40, canvas.height-40 );
}

function updateScore2() {
	ctx.fillStlye = "white";
	ctx.font = "20px Arial, sans-serif";
	ctx.textAlign = "start";
	ctx.textBaseline = "top";
	ctx.fillText("P2: " + pointsP2, 40, 20 );
}

// Function to run when the game overs
function gameOver() {
	ctx.fillStlye = "white";
	ctx.font = "20px Arial, sans-serif";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.fillText("Game Over", W/2, H/2 + 25 );
	ctx.fillText(points + " : " + pointsP2, W/2, H/2 + 50 );
	
	// Stop the Animation
	cancelRequestAnimFrame(init);
	
	// Set the over flag
	over = 1;
	
	// Show the restart button
	restartBtn.draw();
	exitBtn.draw();
}
//
// Start Socket Animation Loop
//

// Function for running the whole animation
function animloop() {
	init = requestAnimFrame(animloop);
	draw();
}

// Function to execute at startup
function startScreen() {
	socket.emit('startGame');
	socket.on('start', function()
{
	animloop();
});
//	socket.emit('startplayers');
//	socket.on('players', function()
//{
//	animloop();
//});
	//draw();
	//startBtn.draw();
}

//This is the function to continue playing after a player has madea point
function startagain() {
		//I couldn't get a new random number each time, so I added some of the code up to to do it
		var rand_velo_x2 = velocity_array[Math.floor(Math.random() * velocity_array.length)];
		var rand_velo_y2 = velocity_array[Math.floor(Math.random() * velocity_array.length)];
		
		cancelRequestAnimFrame(init);
		ball.x = half_width;
		ball.y = half_height;
		ball.vx = rand_velo_x2;
		ball.vy = rand_velo_y2;
		
		//Delay the ball from reanimating right away
		window.setTimeout(function(){animloop()}, 420);

		over = 0;
	
}

// On button click (Restart and start)
function btnClick(e) {
	
	// Variables for storing mouse position on click
	var mx = e.pageX,
		my = e.pageY;
	
	// Click start button
	/*if(mx >= startBtn.x && mx <= startBtn.x + startBtn.w) {
		socket.emit('startGame');
		//animloop();
		// Delete the start button after clicking it
		startBtn = {};
	}*/
	
	// If the game is over, and the restart button is clicked
	if(over == 1) {
		if(mx >= restartBtn.x && mx <= restartBtn.x + restartBtn.w) {
			var rand_velo_x3 = velocity_array[Math.floor(Math.random() * velocity_array.length)];
			var rand_velo_y3 = velocity_array[Math.floor(Math.random() * velocity_array.length)];


			ball.x = half_width;
			ball.y = half_height;
			ball.vx = rand_velo_x3;
			ball.vy = rand_velo_y3;
			pointsP2 = 0;
			points = 0;
			animloop();
			
			over = 0;
		}
		if(mx >= exitBtn.x && mx <= exitBtn.x + exitBtn.w) {
			window.location.href = "http://localhost/xampp/Pong/main.php" // whatever the main page is 
		}
	}
}

// Show the start screen
startBtn.draw();
window.setTimeout(function(){startScreen()}, 1876);
//Detecting the paddles array to seperate out players
//console.log(paddles)



