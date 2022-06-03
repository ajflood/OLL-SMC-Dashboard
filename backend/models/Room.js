const mongoose = require("mongoose")

const roomSchema = new mongoose.Schema(
	{
    name: { type: String },
	building: { type: String },
	occupancy: { type: String },
	},
 	{ timestamps: true }
)

module.exports = mongoose.model('Room', roomSchema)