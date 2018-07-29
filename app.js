//18TH APRIL, UPDATE ROUTE:19TH
//AUTHOR: Jaipreet

var express = require("express"),             //telling our app to use these packages
    mongoose = require("mongoose"),
    bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    expressSanitizer = require("express-sanitizer");
    
var app = express();

mongoose.connect("mongodb://localhost/blog_data");  // connect to this database...or create it.

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(expressSanitizer());


app.set("view engine", "ejs"); // automatically look for .ejs in view

var blogSchema = new mongoose.Schema         //define schema
({
    title: String,
    image: String,
    content: String,
    date: {type: Date, default: Date.now}
    
});

var Blog = mongoose.model("blog", blogSchema); // create blogs colletion in db and tell it to use blog schema

/*
Blog.create
(
{
title: "Man utd V/S Liverpool",
image: "https://www.standard.co.uk/s3fs-public/styles/story_large/public/thumbnails/image/2018/03/10/14/munliv100318y.jpg",
content:"Liverpool were in great form but united wanted to solidify their 2nd place so they went for weakness in liverpool's back line" + 
        "and crushed Lovren.Rashford opened the score with a rolando-esque goal and scored again to win united the match. 2-1 the final scores"
}, 
function(err, blog){
 if(err)
    {
     console.log(err)
    }
    else
    {
     console.log("Sucsess!");
     console.log(blog);
    }
});
*/





app.get("/", function(req, res)
{
    res.redirect("/blogs");
});

app.get("/blogs", function(req, res)
{
   Blog.find({}, function(err, found)
   {
        if(err)
        {
            console.log(err);
        }
        else
        {
        res.render("index", {blogs: found});
        }
   }); 
});

app.get("/blogs/new", function(req, res) {
   res.render("form"); 
});


app.post("/blogs", function(req, res){
   var title= req.body.title;
   var image= req.body.image;
   var content= req.body.content;
   
   var newBlog= { title: title,
                  image: image,
                  content: content
                 };
                 
    req.newBlog= req.sanitize(newBlog);
    
   Blog.create(newBlog, function(err, created)
     {
         if(err)
         {
             console.log(err);
         }
         else
         {
             res.redirect("/blogs");
         }
     
   });
});

app.get("/blogs/:id", function(req, res) {
   Blog.findById(req.params.id, function(err, foundBlog)
   {
       if(err)
       {
           console.log(err);
       }
       else
       {
           res.render("show", {blogs: foundBlog});
       }
   });
});

app.get("/blogs/:id/edit", function(req, res) {
   
    Blog.findById(req.params.id, function(err, found)
     {
       if(err)
       {
           console.log(err);
       }
       else
       {
           res.render("edit", {blogs: found});  
       }
     });
});

app.put("/blogs/:id", function(req, res)
{
   var title= req.body.title;
   var image= req.body.image;
   var content= req.body.content;
   
   var updatedBlog= { title: title,
                  image: image,
                  content: content
                 };
                 
   Blog.findByIdAndUpdate(req.params.id, updatedBlog, function(err, updated)
   {
       if(err)
       {
           console.log(err);
       }
       else
       {
           res.redirect("/blogs/" + req.params.id );
       }    
       
   });
   
});

app.delete("/blogs/:id", function(req, res)
{
   Blog.findByIdAndRemove(req.params.id, function(err, deleted)
   {
       if(err)
       {
           console.log("Error while deleting the post");
           console.log(err)
       }
       else
       {
           res.redirect("/blogs");
       }
   })
   
});



    
app.listen(process.env.PORT, process.env.IP, function()
{
    console.log("Started...");
});
    