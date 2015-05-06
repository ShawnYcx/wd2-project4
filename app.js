
var app = require('express')();
var express = require('express');

var http = require('http').Server(app);
var io = require('socket.io')(http);


app.use('/css', express.static(__dirname + "/css"));
app.use('/js', express.static(__dirname + "/js"));

var players = [];
var numPlayers = 0;
var W = 750;
var H = 560;
//var time = 10;
var hits = 0;
var p1win = 0;
var p2win = 0;
var scoreboardp1 = 0;
var scoreboardp2 = 0;
var winText;
var velocity_array = [-2,-1.75,-1.5,-1.25,-1,1,1.25,1.5,1.75,2];

var paddle1 = {
          x: -10,
          y: 10,
          vx: 0,
          vy: 0,
          width: 175,
          height: 20,
        };
var paddle2 = {
          x: 5,
          y: 345,
          vx: 0,
          vy: 0,
          width: 175,
          height: 20,
        };
var ball = {
          x: 100,
          y: 100, 
          r: 7,
          c: "black",
          vx: 1000,
          vy: 1000,
        };

//var rooms = ['room1'];

    app.get('/', function (req, res) {
	    res.sendFile(__dirname + '/game.html')
	});

	io.on('connection', function (socket) {
		players.push(socket);
		//io.emit("playerCountUpdate", players.length);
		//socket.emit('start', startmsg);
		console.log(players.indexOf(socket));
		io.emit('numPlayers', players.length);
		socket.emit('getPlayerId', players.indexOf(socket));
		socket.on('movePaddle', function(msg, playerid)
		{
			if(playerid % 2 ==  0)
			{
				paddle1 = msg;
				io.emit('updatePaddles', paddle1, playerid);
			}
			else if(playerid % 2 == 1)
			{
				paddle2 = msg;
				io.emit('updatePaddles', paddle2, playerid);
			}
		});

		// socket.on('moveBall', function(msg){
		// 	ball = msg;
		// 	collide(ball, paddle1, paddle2);
		// 	io.emit('updateBall', ball);
		// })
	   socket.on('disconnect', function() {
			console.log("disconnect");
			var i = players.indexOf(socket);
			console.log(i);
			players = players.splice(1,i);
			console.log(players.length);
			io.emit('numPlayers', players.length);
		});

	});

    function resetBoard(){
      p1win = 0;
      p2win = 0;
    }

	 function collide(b, p1, p2) {
          if(b.y + b.r >= p2.y && b.y + b.r <= p2.y + p2.height) {
            if(b.x >= p2.x && b.x <= p2.x + p2.width && b.vy > 0){
              b.vy *= -1;
              hits++;
            }
          }
          else if(b.y - b.r >= p1.y && b.y - b.r <= p1.y + p1.height) {
            if(b.x >= p1.x && b.x <= p1.x + p1.width && b.vy < 0){
              b.vy *= -1;
              hits++;
            }
          }
          //  else if(b.y + b.r >= p1.y && b.y + b.r <= p2.y + p2.height) {
          //   if(b.x - b.r >= p2.x && b.x - b.r <= p2.x + p2.width){
          //     b.vy *= -1;
          //   }
          // }
          //   else if(b.y - b.r >= p1.y && b.y - b.r <= p2.y + p2.height) {
          //   if(b.x - b.r >= p1.x && b.x - b.r <= p1.x + p1.width){
          //     b.vy *= -1;
          //   }
          // }
          else if(b.x - b.r <= 0 || b.x + b.r >= W) {
            b.vx *= -1;
          }
          if(b.y + b.r < 0) {
            b.vx = 0;
            b.vy = 0;
            if (p1win + 1 == 14){
              //reset function
              resetBoard();
              scoreboardp1++;
            }else{
              p1win++;
            }
            io.emit('scoreUpdate', p1win, 1); 
            //hits = 0;
          }
          else if(b.y - b.r > H) {
            b.vy = 0;
            b.vx = 0;
            if (p2win + 1 == 14){
              //reset function
              resetBoard();
              scoreboardp2++;
            }else {
              p2win++;
              
            }
            io.emit('scoreUpdate', p2win, 2); 
            //hits = 0;
          }

    }
    // function changeIt() {
    // 	console.log(time);
    // 	return time;
    // }
    // function callback()
    // {
    // 	time-= 0.5;
    // 	ball.x += ball.vx;
	   //  		ball.y += ball.vy;
				// collide(ball, paddle1, paddle2);
				// if(ball.vy == 0 && ball.vx == 0)
	   //          {
	   //            ball.x = W/2;
	   //            ball.y = H/2;
	   //            ball.vx = 1;
	   //            ball.vy = -1;
	   //            time = 10;
	   //          }
				// //console.log(ball.x, ball.y);
				// io.emit('updateBall', ball);
				// console.log(time);
    // 	setTimeout(callback, time);
    // }
    // setTimeout(callback, 500);
//var loop;
    //setTimeout(function(){
    //	time--;
    //	console.log(time);

	   	setInterval(function(){

	    		ball.x += ball.vx;
	    		ball.y += ball.vy;
				collide(ball, paddle1, paddle2);
				if(ball.vy == 0 && ball.vx == 0)
	            {
	              ball.x = W/2;
	              ball.y = H/2;
	              var rand_velo_x = velocity_array[Math.floor(Math.random() * velocity_array.length)];
				  var rand_velo_y = velocity_array[Math.floor(Math.random() * velocity_array.length)];
	              ball.vx = rand_velo_x;
	              ball.vy = rand_velo_y;
	              hits = 0;
	              //time = 10;
	            }
	            // else if(hits % 10 == 0)
	            // {
	            // 	if(ball.vx <0)
	            // 		ball.vx--;
	            // 	else
	            // 		ball.vx++;
	            // 	if(ball.vy <0)
	            // 		ball.vy--;
	            // 	else
	            // 		ball.vy++;
	            // }
				//console.log(ball.x, ball.y);
				io.emit('updateBall', ball, hits);
	    }, 10);
	    
    // }, 500);
   // clearInterval(loop);

http.listen(3000, function() {
	console.log('Connection success: ');
	console.log('  listening on *:3000');
});

