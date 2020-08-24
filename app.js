const { Passport } = require("passport");
const user = require("./models/user");

var express    = require("express"),
    app        = express(),
    bodyParser = require("body-parser"),
    mongoose   = require("mongoose"),
    flash       = require("connect-flash"),
    passport   = require("passport"),
    methodOverride = require("method-override"),
    LocalStrategy = require("passport-local"),
    Campground = require("./models/campground"),
    Comment    = require("./models/comment"),
    User       = require("./models/user"),
    seedDB     = require("./seeds");
//Requiring Routes
var commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes     = require("./routes/index");

// seedDB();
// mongoose.connect("mongodb://localhost/yelp_camp", { useNewUrlParser: true,  useUnifiedTopology: true});
mongoose.connect(process.env.DATABASEURI || "mongodb://localhost/yelp_camp", { useNewUrlParser: true,  useUnifiedTopology: true});

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");      //allows the app to recognize the ejs files as default
app.use(flash());

//Passport Configuration
app.use(require("express-session")({
    secret: "Campgrounds are the best place to hangout!",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    
    next();
});

app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);

app.listen(process.env.PORT||3000, process.env.IP);