const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
	name: {
		type: String,
		required: true
	}
});
const Model = mongoose.model('User', userSchema);
module.exports = Model;