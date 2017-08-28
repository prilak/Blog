var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var app = express();

mongoose.connect("mongodb://localhost/blog", { useMongoClient: true });
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static("public"));

var todoSchema = new mongoose.Schema({
    body: String,
    complete: {type: Boolean, default: false},
    created: {type: Date, default: Date.now}
});
var Todo = mongoose.model("Todo", todoSchema);
// Todo.create({
//     body: "create a create to do",
// });
//Home Page
//direct to git hub
//direct to projects (game, cookbook, todo list)
//direct to login
app.get("/", function(req, res){
    res.send("please work!"); 
});
//To Do App
//direct to git hub
//create a list of things to do
//show previous things done
app.get("/todo", function(req, res){
    Todo.find({}, function(err, todos){
        if(err){
            console.log(err);
        } else {
            res.render("index", {todos: todos});
            console.log(todos);
        }
    });
    
});
app.listen(process.env.PORT, process.env.IP, function(){
	console.log("server is running");
});