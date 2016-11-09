/*
 * JACK'S RESTFUL BLOG APP 
 * Note: Make sure to run ./mongod in another command window before running app.js 
 * Shut it down when finished working completely.
 */
 
// SETUP VARAIBLES AND DEPENDENCIES
var bodyParser       = require("body-parser"),
    expressSanitizer = require("express-sanitizer"),
    methodOverride   = require("method-override"),
    mongoose         = require("mongoose"),
    express          = require("express"),
    app              = express();
    
// Connect to Mongo DB
mongoose.connect("mongodb://localhost/restful_blog_app");
// Setup Embedded JS view engine
app.set("view engine", "ejs");  
// Serve custom stylesheet
app.use(express.static("public"));
// Setup body parser to collect form data
app.use(bodyParser.urlencoded({extended: true}));
// Setup Express Sanitizier to avoid hackers writing <script> tags in blog posts.
app.use(expressSanitizer());
// Setup methodOverride for PUT request in the Blog EDIT page (HTML PAGES DON'T SUPPORT PUT REQUESTS)
app.use(methodOverride("_method"));


/*
 * BLOG SCHEMA
 */
 
// Setup Blog Schema -- Each new blog post will have these elements.
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});

// Create model Schema **MAKE SURE YOU HAVE ADDED EVERYTHING YOU WANT TO THE SCHEMA BEFORE RUNNING THE MODEL.
var Blog = mongoose.model("Blog", blogSchema);

/*
 * RESTFUL ROUTES -- INDEX, NEW, CREATE, SHOW, EDIT, UPDATE, DESTROY. 
 */
 
//HOMEPAGE
app.get("/", function(req, res) {
    res.redirect("/blogs");
});

/*
 ******************* INDEX ROUTE *****************************
 */
 
// Displays index page (located in the views folder).
app.get("/blogs", function(req, res) {
// Retrieve all blogs from database
   Blog.find({}, function(err, blogs) {
       if (err) {
           console.log(err);
       } else {
           res.render("index", {blogs:blogs}); 
       }
   });
});

/*
 ******************* CREATE ROUTE *****************************
 */

// POST ROUTE: Sends data back to "/blogs" page
app.post("/blogs", function(req, res) {
    //Sanitize blog
    req.body.blog.body = req.sanitize(req.body.blog.body);
    // Create new Blog Post
    Blog.create(req.body.blog, function(err, newBlog) {
        if (err) {
            res.render("/new");
            console.log(err);
        } else {
            res.redirect("/blogs");
            console.log(req);
        }
    });
});

// Render New Post page.
app.get("/blogs/new", function(req, res) {
    res.render("new");
});


/*
 ******************* SHOW ROUTE *****************************
 */

//Displays specific blog post on separate page.
app.get("/blogs/:id", function(req, res) {
   Blog.findById(req.params.id, function(err, foundBlog) {
     if (err) {
         res.redirect("/blogs");
     } else {
         res.render("show", {blog:foundBlog});
     }
   });
});

/*
 ******************* EDIT ROUTE *****************************
 */
 
app.get("/blogs/:id/edit", function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog) {
        if (err) {
            res.rediret("/blogs");
        } else {
            res.render("edit", {blog: foundBlog});
        }
    })
    
});

/*
 ******************* UPDATE ROUTE *****************************
 */
app.put("/blogs/:id", function(req, res){
    //FindByIdAndUpdate method takes 3 arguments: the blog ID, the NEW blog Data, the callback Function
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog) {
        if (err) {
            res.redirect("/blogs");
        } else {
            //Redirect back to the specific blog post
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

/*
 ******************* DELETE ROUTE ****************************
 */
 
 app.delete("/blogs/:id", function(req, res) {
     Blog.findByIdAndRemove(req.params.id, function(err) {
         if (err) {
             res.redirect("/blogs");
         } else {
             res.redirect("/blogs");
         }
     });
});

/*
 ******************* CONNECT SERVER ***************************
 */
app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Server is running!");
});
    


