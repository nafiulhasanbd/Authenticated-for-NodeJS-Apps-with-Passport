var express                 = require("express");
var mongoose                = require("mongoose");
var passport                = require("passport");
var bodyParser              = require("body-parser");
var User                    = require("./models/user")
var localStrategy           = require("passport-local");
var passportLocalMongoose   = require("passport-local-mongoose");

mongoose.connect("mongodb://localhost/auth_demo_app", function(err, connected){
    if(err){
        console.log(err);
    }else{
        console.log("DB Connected");
    }
})


var app = express();
app.set("view engine", "ejs");

app.use(require("express-session")({
    secret: "nafiul is a Developer",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({extended:true}));

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// ROUTES

app.get("/", function(req, res){
    res.render("home")
});


app.get("/secret", isLoggedIn, function(req, res){
   res.render("secret"); 
});

// Auth Routes


// Show Signup form
app.get("/register", function(req, res){
    res.render("register");
})

// handing User Singup
app.post('/register', function(req, res){
    User.register(new User({username:req.body.username}), req.body.password, function(err, user){
        if(err){
            console.lop("err");
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/secret");
        })
    })
})



// Login Routes

app.get("/login", function(req, res){
     res.render("login");
})


app.post("/login", passport.authenticate("local", {
    successRedirect:"/secret",
    failureRedirect :"/login"
}) ,function(req, res){
    
})

app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/")
})




// Login check
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login")
}




























const port = 3000;

app.get('/', (request, response) => {
  response.send('Hello from Express!')
})

app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
})