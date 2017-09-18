var mongoose = require("mongoose");

var foodSchema = new mongoose.Schema({
    name: String,
    type: String,
    cost: Number,
    calories: Number
});
module.exports = mongoose.model("Food", foodSchema);