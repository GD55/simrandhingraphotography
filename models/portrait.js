var mongoose = require("mongoose");
//SCEMA SETUP
var portraitImageSchema = new mongoose.Schema({
	order: Number,
	img: String,
});

module.exports = mongoose.model("portraitImage",portraitImageSchema);