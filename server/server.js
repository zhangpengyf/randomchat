var net = require('net');

var server = net.createServer();

var dataBufferForSocket = new Map();
var receivedData = new Buffer(0);


var sdpReadyUsers = new Map();
var pairedUser = new Map();

var Commands = {
	login: 'login',
	sdp: 'sdp',
	startchat: 'startchat',
	stopchat:'stopchat'
}

function doPair(socket1, socket2) {
	var sdp1 = sdpReadyUsers.get(socket1);
	var sdp2 = sdpReadyUsers.get(socket2);
	pairedUser.set(socket1, sdp1);
	pairedUser.set(socket2, sdp2);
	sdpReadyUsers.delete(socket1);
	sdpReadyUsers.delete(socket2);

	socket1.write(sdp2);
	socket1.write('\0');

	socket2.write(sdp1);
	socket2.write('\0');

	console.log('paired ok');
}

//收到用户的sdp，准备就绪
function handleSdp(socket, sdp) {
	sdpReadyUsers.set(socket, sdp);
} 

function handleStopchat(socket) {
	console.log('stop chat');
	var sdp = pairedUser.get(socket);
	if(sdp) {
		sdpForUser.set(socket, sdp);
		pairedUser.delete(socket);
	}
}

function handleStartchat(socket) {
	var bFindMy = false;
	var bFindHis = false;
	sdpReadyUsers.forEach(function (value, key, map) {
		//不是本人
		if(key != socket) {
			bFindHis = true;
			parttnerSocket = key;
		}
		if(key == socket) {
			bFindMy = true;
		}
	});

	if(bFindHis && bFindMy) {
		doPair(socket, parttnerSocket);
	}
}

function handleCommand(socket, jsonData) {
	console.log('receive command:' + jsonData.command);
	switch(jsonData.command) {
		case Commands.login:
		{
			console.log(jsonData.username + " logined");
			break;
		}
		case Commands.sdp: {
			handleSdp(socket, jsonData.sdp);
			break;
		}
		case Commands.startchat:
		{
			handleStartchat(socket);
			break;
		}
		case Commands.stopchat:
		{
			hndleStopchat(socket);
			break;
		}
		default:
		{
			console.log('receive invalid command', jsonData);
		}
	}
}

function handleDisconnect(socket) {
	console.log('connection closed');
	sdpReadyUsers.delete(socket);
	pairedUser.delete(socket);
}

//接受新的客户端连接
server.on('connection', function (socket) {
	console.log('got a new connection');
	//从连接中读取数据
	socket.on('data', function (tcpdata) {
		var remainData = dataBufferForSocket.get(socket);
		if(!remainData) {
			remainData = new Buffer(0);
		}

		var newBuffer = Buffer.from(tcpdata);
		remainData = Buffer.concat([remainData, Buffer.from(tcpdata)]);
		for(var i = 0; i < remainData.length; i++)
		{
			if(remainData[i] == 0) {
				var command = remainData.slice(0, i);
				//try {
					var jsonData = JSON.parse(command.toString());
					handleCommand(socket, jsonData);
				// } catch (error) {
				// 	console.log("receive error:", String(command));
				// }
				remainData = remainData.slice(i + 1, remainData.length);
				i = 0;
			}
		}
		dataBufferForSocket.set(socket, remainData);
	});

	//广播数据
	//每当一个已连接的用户输入数据，就将这些数据广播给其他所有已连接的用户
	// sockets.forEach(function(otherSocket){
	// 	if (otherSocket !== socket){
	// 		otherSocket.write(data);
	// 	}
	// });

	socket.on('end', function () {
		receivedData = new Buffer(0);
	});

	socket.on('error', function () {
	});

	//删除被关闭的连接
	socket.on('close', function () {
		handleDisconnect(socket);
	});
});

server.on('error', function (err) {
	console.log('Server error:', err.message);
});

server.on('close', function () {
	console.log('Server closed');
});

console.log('listening on 4000');
server.listen(4000);
