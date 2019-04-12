var mongoose = require("mongoose");
//SCEMA SETUP
var makeUpImageSchema = new mongoose.Schema({
	order: Number,
	img: String,
});

module.exports = mongoose.model("makeUpImage",makeUpImageSchema);