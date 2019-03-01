const server = require('net').createServer();
let counter = 1;
let sockets = {};

function timestamp() {
	const now = new Date;
	return `${now.getHours()}:${now.getMinutes}`
}

server.on('connection', socket => {
	socket.id = counter++;

	console.log('Client connected!');
	socket.write('Please enter your name');

	socket.on('data', data => {
		if (!sockets[socket.id]) {
			socket.name = data.toString().trim();
			socket.write(`Welcome ${socket.name}!\n`);
			sockets[socket.id] = socket;
			return;
		}
		Object.entries(sockets).forEach(([key, cs]) => {
			// if (socket.id == key) return;
			cs.write(`${socket.name} ${timestamp()}: `);
			cs.write(data);
		});
	});

	socket.on('end', () => {
		delete sockets[socket.id];
		console.log('Client disconnected!');
	})

	socket.on('error', (err) => {
		console.log(err);
		process.exit(1);
	})
})

server.listen(8000, () => console.log('Server started at port 8000!'))