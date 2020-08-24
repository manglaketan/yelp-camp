const campground = require("../models/campground");

var express = require("express"),
    router  = express.Router({mergeParams: true}),
    Campground = require("../models/campground"),
    Comment     = require("../models/comment"),
    middleware = require("../middleware");

router.get("/new", middleware.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err)
        {
            console.log(err);
        }
        else
        {
            res.render("comments/new", {campground: campground});
        }
    })
});

router.post("/", middleware.isLoggedIn ,function(req, res){
    //lookup camground using ID
    Campground.findById(req.params.id, function(err, campground){
        if(err)
        {
            console.log(err);
            res.redirect("/campgrounds");
        }
        else
        {
            Comment.create(req.body.comment, function(err, comment){
                if(err)
                {
                    req.flash("error", "Something Went Wrong!");
                    res.redirect("back");
                    console.log(err);
                }
                else
                {
                    //add a username and ID to the comment
                    comment.author.id = req.user.id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    // console.log(comment);
                    req.flash("success", "Successfully Added Comment!")
                    res.redirect("/campgrounds/"+campground._id);
                }
            })
        }
    });
});


//Comments Edit Route
router.get("/:comment_id/edit", middleware.checkCommentOwnership ,function(req,res){
    Comment.findById(req.params.comment_id, function(err, comment){
        if(err){
            res.redirect("back");
        }
        else{
            Campground.findById(req.params.id, function(err, campground){
                if(err){
                    res.redirect("back");
                }
                else{
                    res.render("comments/edit", {campground: campground, comment:comment});
                }
            })
        }
    })
});

//Comments Update Route
router.put("/:comment_id", middleware.checkCommentOwnership ,function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updateComment){
        if(err){
            res.redirect("back");
        }
        else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//Destroy Comment
router.delete("/:comment_id", middleware.checkCommentOwnership ,function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err)
            res.redirect("back");
        else
        {
            req.flash("success", "Comment Deleted!")
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

module.exports = router;