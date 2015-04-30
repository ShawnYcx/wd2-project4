
var app = require('express')();
var express = require('express');

var http = require('http').Server(app);
var io = require('socket.io')(http);


app.use('/css', express.static(__dirname + "/css"));
app.use('/js', express.static(__dirname + "/js"));

var players = [];
var paddle1;
var paddle2;
var ball;

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
			if(playerid %2 ==  0)
			{
				paddle1 = msg;
				io.emit('updatePaddles', paddle1, playerid);
			}
			else if(playerid %2 == 1)
			{
				paddle2 = msg;
				io.emit('updatePaddles', paddle2, playerid);
			}
		});

	// socket.on('disconnect', function() {
	// 		console.log("disconnect");
	// 		var i = players.indexOf(socket);
	// 		console.log(i);
	// 		players = players.splice(1,i);
	// 		//io.emit("playerCountUpdate", players.length);
	// 		io.emit('playerLeft', i);
	// 	});


		// players.push(socket);
		// console.log("Player "+players.indexOf(socket)+"connected");
		// //socket.room = 'room1';
		// //socket.join('room1');

		// if(players.count == 0) {
		// 	console.log("No players");
		// }
		// else{
		// 	//Get postion of mouse, in script.js send console log 
		// 	socket.on('getPos', function (ms)
		// 	{
		// 		socket.emit('returnPos', ms);
		// 		//console.log("RECIEVED MOUSE");
		// 	});
		// }
		// if(players.count == 1) {
		// 	console.log("Only one player")
		// }
		// else{
		// 	//Position for player 2
		// 	console.log("...")
		// 	socket.on('getPos2', function (ms2)
		// 	{
		// 		socket.emit('returnPos2', ms2);
		// 		//console.log("RECIEVED MOUSE");
		// 	});
		// }
		
		
		
		// //
		// // socket.on('startGame', function()
		// // {
		// // 	if (players.length == 2){
		// // 	socket.emit('start');
		// // 	}
		// // });
		

		// socket.on('disconnect', function() {
		// 	// console.log("Player "+players.indexOf(socket)+" disconnected");
		// 	// var i = players.indexOf(socket);
		// 	// console.log(i);
		// 	// players = players.splice(1,i);
		// });
	});

http.listen(3000, function() {
	console.log('Connection success: ');
	console.log('  listening on *:3000');
});

