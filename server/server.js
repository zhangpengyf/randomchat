var net = require('net');

var server = net.createServer();

//聚合所有客户端
var sockets = [];
function handleCommand(jsonData) {
    console.log('receive command:' + jsonData.command);
    console.log(jsonData);
}

//接受新的客户端连接
server.on('connection', function(socket){
	console.log('got a new connection');
	sockets.push(socket);
	//从连接中读取数据
	socket.on('data', function(data){
        try {
            var jsonData =  JSON.parse(data);
            handleCommand(jsonData);
        } catch (error) {
            console.log("receive error:", String(data));
        }

		//广播数据
		//每当一个已连接的用户输入数据，就将这些数据广播给其他所有已连接的用户
		// sockets.forEach(function(otherSocket){
		// 	if (otherSocket !== socket){
		// 		otherSocket.write(data);
		// 	}
        // });
        
        socket.on('error',function(){  
            console.log("error");  
            var index = sockets.indexOf(socket);
			sockets.splice(index, 1);
          }); 

		//删除被关闭的连接
		socket.on('close', function(){
			console.log('connection closed');
			var index = sockets.indexOf(socket);
			sockets.splice(index, 1);
		});
	});
});

server.on('error', function(err){
	console.log('Server error:', err.message);
});

server.on('close', function(){
	console.log('Server closed');
});

console.log('listening on 4000');
server.listen(4000);
