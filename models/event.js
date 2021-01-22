const { string } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const EventSchema = new Schema({
	date: String,
	title: String,
	geometry: {
		type: {
			type: String,
			enum: ["Point"],
			required: false,
		},
		coordinates: {
			type: [Number],
			required: false,
		},
	},
	type: String,
	price: Number,
	images: { url: String, filename: String },
	location: String,
	description: String,
	author: {
		type: Schema.Types.ObjectId,
		ref: "User",
	},
	comments: [
		{
			type: Schema.Types.ObjectId,
			ref: "Comment",
		},
	],
});
module.exports = mongoose.model("Event", EventSchema);
