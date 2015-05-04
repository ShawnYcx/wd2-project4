
var app = require('express')();
var express = require('express');

var http = require('http').Server(app);
var io = require('socket.io')(http);


app.use('/css', express.static(__dirname + "/css"));
app.use('/js', express.static(__dirname + "/js"));

var players = [];
var W = 500;
var H = 375;
var time = 100;
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
          vx: 1,
          vy: -1,
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

	});

	 function collide(b, p1, p2) {
          if(b.y + b.r >= p2.y && b.y + b.r <= p2.y + p2.height) {
            if(b.x >= p2.x && b.x <= p2.x + p2.width && b.vy > 0){
              b.vy *= -1;
            }
          }
          else if(b.y - b.r >= p1.y && b.y - b.r <= p1.y + p1.height) {
            if(b.x >= p1.x && b.x <= p1.x + p1.width && b.vy < 0){
              b.vy *= -1;
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
            //p1win++;
          }
          else if(b.y - b.r > H) {
            b.vy = 0;
            b.vx = 0;
            //p2win++;
          }

    }
    // function changeIt() {
    // 	console.log(time);
    // 	return time;
    // }

    setInterval(function(){
    	//time--;
	    setInterval(function(){
	    		ball.x += ball.vx;
	    		ball.y += ball.vy;
				collide(ball, paddle1, paddle2);
				if(ball.vy == 0 && ball.vx == 0)
	            {
	              ball.x = W/2;
	              ball.y = H/2;
	              ball.vx = 1;
	              ball.vy = -1;
	            }
				//console.log(ball.x, ball.y);
				io.emit('updateBall', ball);

	    }, time);
     }, 500);

http.listen(3000, function() {
	console.log('Connection success: ');
	console.log('  listening on *:3000');
});

