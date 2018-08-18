const env = process.env.NODE_ENV || 'development',
		config = require('./config')[env],
		mongoose = require('mongoose');

module.exports = function () {
	mongoose.Promise = global.Promise;
	const db = mongoose.connect(config.db, {useNewUrlParser: true});

	mongoose.connection.on('error', function (err) {
		console.log('Error: Could not connect to MongoDB. Did you forget to run `mongod`?');
	}).on('open', function () {
		console.log('Connection established with MongoDB')
	});

	return db;
};