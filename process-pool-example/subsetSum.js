const EventEmitter = require('events').EventEmitter;
// const wrStream = require('./wrStream');

module.exports = class SubsetSum extends EventEmitter {
	constructor(sum, set) {
		super();
		this.sum = sum;
		this.set = set;
		this.totalSubset = 0;
	}

	_combine(set, subset) {
		for (let i = 0; i < set.length; i++) {
			// wrStream(subset);
			let newSubset = subset.concat(set[i]);
			this._combine(set.slice(i + 1), newSubset);
			this._processSubset(newSubset);
		}
	}

	_processSubset(subset) {
		console.log('Subset', ++this.totalSubset, subset);
		const res = subset.reduce((prev, item) => (prev + item), 0);
		if (res == this.sum) {
			this.emit('match', subset);
		}
	}

	start() {
		this._combine(this.set, []);
		this.emit('end');
	}
}