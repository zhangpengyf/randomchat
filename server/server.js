var net = require('net');

var server = net.createServer();

//聚合所有客户端
var sockets = [];
var receivedData = new Buffer(0);

function handleCommand(jsonData) {
	console.log('receive command:' + jsonData.command);
}

//接受新的客户端连接
server.on('connection', function (socket) {
	console.log('got a new connection');
	sockets.push(socket);
	//从连接中读取数据
	socket.on('data', function (tcpdata) {
		var newBuffer = Buffer.from(tcpdata);
		receivedData = Buffer.concat([receivedData, Buffer.from(tcpdata)]);
		for(var i = 0; i < receivedData.length; i++)
		{
			if(receivedData[i] == 0) {
				var command = receivedData.slice(0, i);
				try {
					var jsonData = JSON.parse(command.toString());
					handleCommand(jsonData);
				} catch (error) {
					console.log("receive error:", String(command));
				}
				receivedData = receivedData.slice(i + 1, receivedData.length);
				i = 0;
			}
		}
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
		console.log('connection closed');
		var index = sockets.indexOf(socket);
		sockets.splice(index, 1);
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
