var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var methodOverride = require("method-override");
var app = express();

mongoose.connect("mongodb://localhost/blog", { useMongoClient: true });
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(methodOverride("_method"));



var todoSchema = new mongoose.Schema({
    body: String,
    complete: {type: Boolean, default: false},
    created: {type: Date, default: Date.now}
});
var Todo = mongoose.model("Todo", todoSchema);
var blockSchema = new mongoose.Schema({
    title: String,
    complete: {type: Boolean, default: false},
    created: {type: Date, default: Date.now},
    todos: [todoSchema]
});
var Block = mongoose.model("Block", blockSchema);

// var newBlock = new Block({
//     title: "Testing" 
// });
// newBlock.todos.push({
//     body: "create better templates"
// });
// newBlock.save(function(err, block){
//     if(err){
//         console.log(err);
//     } else {
//         console.log(block);
//     }
// });
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

//index
app.get("/todo", function(req, res){
    Block.find({}, function(err, blocks){
        if(err){
            console.log(err);
        } else {
            res.render("index", {blocks: blocks});
            //console.log(todos);
        }
    });
    
});
//new
app.get("/todo/new", function(req, res) {
    res.render("new");
});
//create
app.post("/todo", function(req, res){
    Block.create(req.body.todo, function(err, newBlock){
        if(err){
            res.render("new");
        } else {
            //var newBlockObj = JSON.parse(newBlock);
            console.log(newBlock);
            res.redirect("/todo/" + newBlock._id);
        }
    });
});
//show
app.get("/todo/:id", function(req, res) {
    Block.findById(req.params.id, function(err, foundBlock){
        if(err){
            res.redirect("/todo");
        } else {
            res.render("show", {block: foundBlock});
        }
    });
});
//delete
app.delete("/todo/:id", function(req, res){
   Block.findByIdAndRemove(req.params.id, function(err){
       if(err){
           console.log(err);
           res.redirect("/todo");
       } else {
           console.log("deleted");
           res.redirect("/todo");
       }
   }) 
});

app.listen(process.env.PORT, process.env.IP, function(){
	console.log("server is running");
});