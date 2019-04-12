var mongoose = require("mongoose");
//SCEMA SETUP
var videosSchema = new mongoose.Schema({
	order: Number,
	title: String,
	link: String,
});

module.exports = mongoose.model("video",videosSchema);