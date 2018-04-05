var net = require('net');
var port = 4000;
var quitting = false;
var conn;
var retryTimeout = 3000;	//三秒，定义三秒后重新连接
var retriedTimes = 0;	//记录重新连接的次数
var maxRetries = 10;	//最多重新连接十次

//连接时设置最多连接十次，并且开启定时器三秒后再连接
(function connect() {
	function reconnect() {
		if (retriedTimes >= maxRetries) {
			throw new Error('Max retries have been exceeded, I give up.');
		}
		retriedTimes += 1;
		setTimeout(connect, retryTimeout);
	}

	conn = net.createConnection(port);

	conn.on('connect', function () {
		retriedTimes = 0;
		console.log('connect to server');
		sendMsg();
	});

	conn.on('error', function (err) {
		console.log('Error in connection:', err);
	});

	conn.on('close', function () {
		if (!quitting) {
			console.log('connection got closed, will try to reconnect');
			reconnect();
		}
	});

	function sendMsg() {
		sendLogin();
		sendSdp();
		sendStartChat();
	}

	function sendCommand(json) {
		conn.write(json);
		conn.write('\0');
	}
	function sendLogin() {
		var json = {
			command: 'login',
			username: 'zhangpeng',
			password: '123456'
		}
		var string = JSON.stringify(json)
		console.log('send login,length:' + string.length);
		sendCommand(string);
	}
	function sendSdp() {
		var json = {
			command: 'sdp',
			sdp: 'zhangpeng'
		}
		var string = JSON.stringify(json)
		console.log('send sdp,length:' + string.length);
		sendCommand(string);
	}
	function sendStartChat() {
		var json = {
			command: 'startchat',
			video: true,
			audio: true
		}
		var string = JSON.stringify(json)
		console.log('send startchat,length:' + string.length);
		sendCommand(string);
	}
})();