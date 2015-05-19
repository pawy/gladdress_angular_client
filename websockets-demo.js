var io = require('socket.io')(4000);

console.log('Socket Demo App started...');

io.sockets.on('connection', function (socket) {
	console.log('client connected');

	socket.on('demo:save', function(data) {
		console.log('"demo:save" triggered');

		var messages = [
			'Saving in progress',
			'Validating data',
			'Cross-Check in progress',
			'Saving...',
			'Saved'
		];

		var intervalTimer = setInterval(function() {
			console.log('intervalTimer run');

			socket.emit('demo:save-progress', {
				message: messages.shift(),
				finished: !messages.length
			});

			console.log('"demo:save-progress" emitted');

			if (!messages.length) {
				clearTimeout(intervalTimer);
			}
		}, 1500);
	});
});
