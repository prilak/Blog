var mongoose = require("mongoose");

var todoSchema = new mongoose.Schema({
    body: String,
    due: Date,
    complete: {type: Date, default: null},
    created: {type: Date, default: Date.now}
});
// var Todo = mongoose.model("Todo", todoSchema);

var blockSchema = new mongoose.Schema({
    title: String,
    complete: {type: Boolean, default: false},
    created: {type: Date, default: Date.now},
    todos: [todoSchema]
});

module.exports = mongoose.model("Block", blockSchema);