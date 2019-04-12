var mongoose = require("mongoose");
//SCEMA SETUP
var fashionImageSchema = new mongoose.Schema({
	order: Number,
	img: String,
});

module.exports = mongoose.model("fashionImage",fashionImageSchema);