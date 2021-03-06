
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
var hits = 0;
var p1win = 0;
var p2win = 0;
var ind1 = 0;
var ind2 = 1;
var speedup1 = false;
var speedup2 = false;
var crazy1 = false;
var crazy2 = false;
var scoreboardp1 = 0;
var scoreboardp2 = 0;
var winText;
var start_velocity_array = [-2,-1.75,-1.5,-1.25,-1,1,1.25,1.5,1.75,2];
var velocity_array_neg = [-3, -3.25, -3.5, -3.75, -4, -4.25, -4.5, -4.75, -5];
var velocity_array_pos = [3, 3.25, 3.5, 3.75, 4, 4.25, 4.5, 4.75, 5];
var velocity_array = [-3, -3.25, -3.5, -3.75, -4, -4.25, -4.5, -4.75, -5, 3, 3.25, 3.5, 3.75, 4, 4.25, 4.5, 4.75, 5];
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
          vx: -1,
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
		io.emit('numPlayers', players.length);
		socket.emit('getPlayerId', players.indexOf(socket));
		socket.on('movePaddle', function(msg, playerid)
		{
			if(playerid == ind1)
			{
				paddle1 = msg;
				if(p2win >= 3)
				{
					paddle1.width = 75;
				}
				io.emit('updatePaddles', paddle1, playerid);
			}
			else if(playerid == ind2)
			{
				paddle2 = msg;
				if(p1win >= 3)
				{
					paddle2.width = 75;
				}
				io.emit('updatePaddles', paddle2, playerid);
			}
		});


	   socket.on('disconnect', function() {
			console.log("disconnect");
			var i = players.indexOf(socket);
			players = players.splice(1,i);
			if(i==ind1)
			{
				if(ind1 + 2 > players.length-1)
			      {
			      	ind1=0;
			      }
			}
			else if(i==ind2)
			{
				if(ind2 + 2 > players.length-1)
			      {
			      	ind2=1;
			      }
			}
			console.log(players.length);
			io.emit('numPlayers', players.length);
		});

	});

    function resetBoard(){
      if(ind1 + 2 > players.length-1)
      {
      	ind1=0;
      }
      else
      {
      	ind1+=2;
      }
      if(ind2 + 2 > players.length-1)
      {
      	ind2=1;
      }
      else
      {
      	ind2+=2;
      }
      p1win = 0;
      p2win = 0;
      speedup1 = false;
      speedup2 = false;
      crazy1 = false;
      crazy2 = false;
      paddle1.width = 175;
      paddle2.width = 175;
      io.emit('updateIndex', ind1, ind2);
      io.emit('updatePaddles', paddle1, 0);
      io.emit('updatePaddles', paddle2, 1);
    }

	 function collide(b, p1, p2) {
          if(b.y + b.r >= p2.y && b.y + b.r <= p2.y + p2.height) {
            if(b.x >= p2.x && b.x <= p2.x + p2.width && b.vy > 0){
            	// b.vy *= -1;
            	if(crazy2)
            	{
            	  var rand_velo_x = velocity_array[Math.floor(Math.random() * velocity_array.length)];
				  var rand_velo_y = velocity_array_neg[Math.floor(Math.random() * velocity_array_neg.length)];
				  b.vx = rand_velo_x;
				  b.vy = rand_velo_y;
            	}
            	else if(speedup2)
            	{
            	  b.vy = -3;
            	  if(b.vx < 0)
            	  {
            	  	b.vx = -3;
            	  }
            	  else
            	  {
            	  	b.vx = 3;
            	  }
            	}
            	else
            	{
            		b.vy = -1;
            		if(b.vx < 0)
	            	  {
	            	  	b.vx = -1;
	            	  }
	            	  else
	            	  {
	            	  	b.vx = 1;
	            	  }
            	}
              
              hits++;
            }
          }
          else if(b.y - b.r >= p1.y && b.y - b.r <= p1.y + p1.height) {
            if(b.x >= p1.x && b.x <= p1.x + p1.width && b.vy < 0){
              //b.vy *= -1;
              if(crazy1)
              {
				  var rand_velo_x = velocity_array[Math.floor(Math.random() * velocity_array.length)];
				  var rand_velo_y = velocity_array_pos[Math.floor(Math.random() * velocity_array_pos.length)];
				  b.vx = rand_velo_x;
				  b.vy = rand_velo_y;
              }
              else if(speedup1)
              {
            	  b.vy = 3;
            	  if(b.vx < 0)
            	  {
            	  	b.vx = -3;
            	  }
            	  else
            	  {
            	  	b.vx = 3;
            	  }
              }
              else
            	{
            		b.vy = 1;
            		if(b.vx < 0)
	            	  {
	            	  	b.vx = -1;
	            	  }
	            	  else
	            	  {
	            	  	b.vx = 1;
	            	  }
            	}
              hits++;
            }
          }
      
          else if(b.x - b.r <= 0 || b.x + b.r >= W) {
            b.vx *= -1;
          }
          if(b.y + b.r < 0) {
            b.vx = 0;
            b.vy = 0;
            if (p2win + 1 == 14){
              //reset function
              resetBoard();
              scoreboardp2++;
              
            }
            else{
              p2win++;
              if(p2win >= 10)
              {
              	crazy2 = true;
              }
              else if(p2win >= 6)
              {
              	speedup2 = true;
              }

            }
            io.emit('scoreUpdate', p1win, p2win, scoreboardp1, scoreboardp2); 
          }
          else if(b.y - b.r > H) {
            b.vy = 0;
            b.vx = 0;
            if (p1win + 1 == 14){
              //reset function
              resetBoard();
              scoreboardp1++;

            }else {
              p1win++;
              if(p1win >= 10)
              {
              	crazy1 = true;
              }
              else if(p1win >= 6)
              {
              	speedup1 = true;
              }
           
            }
            io.emit('scoreUpdate', p1win, p2win, scoreboardp1, scoreboardp2); 
            
          }

    }
    

	   	setInterval(function(){

	   		if(players.length > 1)
	   		{
	    		ball.x += ball.vx;
	    		ball.y += ball.vy;
				collide(ball, paddle1, paddle2);
				if(ball.vy == 0 && ball.vx == 0)
	            {
	              ball.x = W/2;
	              ball.y = H/2;
	              ball.vx = -1;
	              ball.vy = -1;
	              hits = 0;
	            }
	            
				io.emit('updateBall', ball, hits);
			}
	    }, 10);
	    
  

http.listen(3000, function() {
	console.log('Connection success: ');
	console.log('  listening on *:3000');
});

