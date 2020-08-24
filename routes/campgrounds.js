var express = require("express"),
    router  = express.Router({mergeParams: true}),
    Campground = require("../models/campground"),
    middleware = require("../middleware");

//Index Route
router.get("/",function(req, res){
    //Get all campgrounds from the database
    Campground.find({}, function(err, campgrounds){
        if(err)
        {
            console.log(err);
        }
        else
        {
            res.render("campgrounds/index", {campgrounds: campgrounds, currentUser: req.user});
        }
    })
});

//Create Route
router.post("/", middleware.isLoggedIn ,function(req, res){
    //get data from the form and add to the campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user.id,
        username: req.user.username
    }
    var newCampground = {name: name, image: image, description: description, author: author};

    //Saving to the database
    Campground.create(newCampground, function(err, newCampground){
        if(err)
        {
            console.log(err);
        }
        else
        {
            res.redirect("/campgrounds");
        }
    });
});

//New Route
router.get("/new",middleware.isLoggedIn ,function(req, res){
    //shows the form to create a new campground
    
    res.render("campgrounds/new");
});


//SHOW ROUTE- Shows the details of a particualr campground
router.get("/:id", function(req,res){
    //Find the campground with given ID and show it on page
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err)
            console.log(err);
        else{
            res.render("campgrounds/show", {campground: foundCampground})
        }
    });
});

//Edit Campgrounds Route
router.get("/:id/edit", middleware.checkCampgroundOwnership ,function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render("campgrounds/edit", {campground: foundCampground});
    });
});

//Update Campgrounds Route
router.put("/:id", middleware.checkCampgroundOwnership ,function(req,res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err)
        {
            res.redirect("/campgrounds");
        }
        else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//Destroy Campground Route
router.delete("/:id", middleware.checkCampgroundOwnership ,function(req,res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err)
            res.redirect("/campgrounds");
        else{
            req.flash("success", "Campground Successfully Removed!")
            res.redirect("/campgrounds");
        }  
    });
});

module.exports = router;