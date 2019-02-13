var bodyParser     = require("body-parser"),
    methodOverride = require("method-override"),
    mongoose       = require("mongoose"),
    express        = require("express"),
    app            = express();
    
    // APP CONFIG
mongoose.connect("mongodb://localhost/restful_blog_app");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));

// MONGOOSE/MODEL CONFIG
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);

// RESTFUL ROUTES
app.get("/", function(req, res){
   res.redirect("/blogs"); 
});

app.get("/blogs", function(req,res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log("ERROR");
        }
        else {
            res.render("index", {blogs:blogs});
        }
    });
});
// NEW ROUTE
app.get("/blogs/new", function(req,res){
    res.render("new");
});
// create route
app.post("/blogs", function(req, res)
{
    //create blog
    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            res.render("new");
        }
        //then redirect to index
        else {
            res.redirect("/blogs")
        }
    });
});

// Show route
app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        }else {
            res.render("show", {blog:foundBlog});
        }
    });
});

// edit route 
app.get("/blogs/:id/edit", function(req, res){
   Blog.findById(req.params.id, function(err, foundBlog){
      if(err){
          res.redirect("blogs");
      } else {
           res.render("edit", {blog:foundBlog});
      }
   });
});

// update route

app.put("/blogs/:id", function(req, res){
    // Check what data has arrived with body as a POST request
    // If null is returned, then error in edit.ejs file
    console.log("Title : " + req.body.blog.title + "\nImage URL : " + req.body.blog.image + "\nDescription : " + req.body.blog.body + "\n");
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
       if(err){
           // Check what error has occurred
           console.log(err);
           res.redirect("/blogs");
       }
       else {
           res.redirect("/blogs/" + req.params.id ); // Added a '/' to the URL that was missing
       }
   });
});
 app.delete("/blogs/:id", function(req, res){
    //  destroy blog
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/blogs");
        }else 
        res.redirect("/blogs")
    })
 });

app.listen(3000, function(){
    console.log("The server has Started")
});