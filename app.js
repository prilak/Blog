var express = require("express");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var methodOverride = require("method-override");
var app = express();

mongoose.connect("mongodb://localhost/blog", { useMongoClient: true });
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));
app.use(methodOverride("_method"));
app.use(require("express-session")({
    secret: "Ziggy is Cool",
    resave: false,
    saveUninitialized: false
}));

// Schemas
var Food = require("./models/food");
//var Recipe = require("./models/recipe");
var Block = require("./models/block");
var User = require("./models/user");

// Set up methods
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// var recipeSchema = new mongoose.Schema({
//     foods: [foodSchema],
//     time: Number
// });
// var Recipe = mongoose.model("Recipe", recipeSchema);



//Home Page
//direct to git hub
//direct to projects (game, cookbook, todo list)
//direct to login
app.get("/", function(req, res){
    res.render("home"); 
});
//To Do App
//direct to git hub
//create a list of things to do
//show previous things done



//---------------------------------
// Authentication
//---------------------------------

app.get("/register", function(req, res) {
    res.render("register"); 
});
app.post("/register", function(req, res) {
    User
})

app.get("/login", function(req, res) {
    res.render("login");
});
app.post("/authorize", function(req, res) {
    //verify
    res.redirect("/todo");
});



//---------------------------------
// Food App
//---------------------------------

//index
app.get("/food", function(req, res) {
    Food.find({}, function(err, foods){
        if(err){
            console.log(err)
        } else {
            res.render("index_food", {foods: foods});
        }
    });
    
});
//new
app.get("/food/new", function(req, res) {
    res.render("new_food");
});
//create
app.post("/food", function(req, res){
    Food.create(req.body.food, function(err, newFood){
        if(err){
            res.render("new_food");
        } else {
            //var newBlockObj = JSON.parse(newBlock);
            console.log(newFood);
            res.redirect("/food");
        }
    });
});
//search
app.get("/food/search", function(req, res) {
    res.render("search_food");
});
//show
app.get("/food/:id", function(req, res) {
    Food.findById(req.params.id, function(err, foundFood){
        if(err){
            res.redirect("/food");
        } else {
            res.render("show_food", {food: foundFood});
        }
    });
});
//delete
app.delete("/food/:id", function(req, res){
   Food.findByIdAndRemove(req.params.id, function(err){
       if(err){
           console.log(err);
           res.redirect("/food");
       } else {
           console.log("deleted");
           res.redirect("/food");
       }
   }) 
});



//---------------------------------
// To Do App
//---------------------------------

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
//delete block
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
//delete todo
app.delete("/todo/:blockId/:todoId", function(req, res){
   Block.findById(req.params.blockId, function(err, foundBlock){
       if(err){
           console.log(err);
           res.redirect("/todo");
       } else {
          for(var i = 0; i < foundBlock.todos.length; i++){
                if(foundBlock.todos[i]._id==req.params.todoId){
                    foundBlock.todos[i].remove();
                }
                
                //console.log(foundBlock.todos[i]);
                
            }
            foundBlock.save(function(err){
                if(!err){
                   console.log("success");
                   } 
            });
            res.redirect("/todo/" + req.params.blockId);
       }
   }) 
});
//new todo
app.get("/todo/:id/new", function(req, res) {
    Block.findById(req.params.id, function(err, foundBlock){
        if(err){
            res.redirect("/todo/" + foundBlock._id);
        } else {
            res.render("new_todo", {block: foundBlock});
        }
    });
});
//create todo
app.post("/todo/:id", function(req, res){
    Block.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/todo/" + req.params.id);
        } else {
            
            var date = new Date(2017, 
                req.body.todo.month, 
                req.body.todo.day, 
                req.body.todo.hours, 
                req.body.todo.minutes);
            foundBlog.todos.push({
                body: req.body.todo.body, 
                due: date
            });
            Block.findByIdAndUpdate(req.params.id, foundBlog, function(err, updateBlog){
                if(err){
                    res.redirect("/todo/" + req.params.id);
                } else {
                    res.redirect("/todo/" + req.params.id);
                }
            });
        }
    });
        
});
//complete todo
app.post("/todo/:idBlock/:idTodo/complete", function(req, res) {
    Block.findById(req.params.idBlock, function(err, foundBlock) {
        if(err){
            res.redirect("/todo");
        } else {
            console.log(foundBlock);
            // foundBlock.todos.forEach(function(todo){
            //     console.log(todo._id);
            //     console.log(req.params.idTodo);
            //     if(todo._id==req.params.idTodo){
            //         todo.complete = true;
            //     }
            // });
            for(var i = 0; i < foundBlock.todos.length; i++){
                console.log(foundBlock.todos[i].complete);
                if(foundBlock.todos[i]._id==req.params.idTodo){
                    foundBlock.todos[i].complete = Date.now();
                }
                console.log(foundBlock.todos[i].complete);
            }
            //foundTodo.complete = true;
            Block.findByIdAndUpdate(req.params.idBlock, foundBlock, function(err, completeBlock){
                if(err){
                    res.redirect("/todo");
                } else {
                    res.redirect("/todo/" + req.params.idBlock);
                }
            });
        }
    }) 
});
app.listen(process.env.PORT, process.env.IP, function(){
	console.log("server is running");
});