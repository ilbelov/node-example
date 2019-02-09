const http = require('http');
// const SubsetSum = require('./subsetSum');
const SubsetSum = require('./subsetSumFork');

http.createServer((req, res) => {
	const url = require('url').parse(req.url, true);
	
	if (url.pathname === '/subsetSum') {
		const data = JSON.parse(url.query.data);
		res.writeHead(200);
		const subsetSum = new SubsetSum(url.query.sum, data);
		subsetSum.on('match', match => {
			res.write('Match: ' + JSON.stringify(match) + '\n');
		});
		subsetSum.on('end', () => {
			res.end();
		})
		subsetSum.start();
	} else {
		res.writeHead(200);
		res.end('Im alive!\n')
	}
}).listen(8000, () => console.log('Started!'));