var express = require("express"),
    router  = express.Router(),
    passport = require("passport"),
    User    = require("../models/user"),
    middleware = require("../middleware");

//Landing Page
router.get("/", function(req, res){
    res.render("landing");
});

//Show register Form
router.get("/register", function(req,res){
    res.render("register");
})

//Sign Up Logic
router.post("/register", function(req, res){

    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.redirect("/register");
        }

        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome To YelpCamp "+ user.username);
            res.redirect("/campgrounds");
        });
    });
});

//show login form
router.get("/login", function(req, res){
    res.render("login");
});

//Login Logic
router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}) ,function(req,res){    
});

//Logout Logic
router.get("/logout", function(req,res){
    req.logOut();
    req.flash("success", "Logged You Out!");
    res.redirect("/campgrounds");
});

module.exports = router;