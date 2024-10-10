const express = require('express');
const router = express.Router({mergeParams:true});
const Comment = require('../models/comment');
const Movie = require('../models/movies');
const isLoggedIn = require('../utils/isLoggedin');
const checkCommentOwner = require('../utils/checkComOwner');

router.get('/new', isLoggedIn , (req,res) => {
    res.render("comments_new",{movie_id: req.params.id})
})

router.post('/', isLoggedIn ,async (req,res) => {
    
    try{
        const comment = await Comment.create({
            user: {
                id: req.user._id,
                username: req.user.username
            },
            text:req.body.text,
            movieId:req.body._id
        })
        req.flash("success","Comment created!");
        res.redirect(`/movies/${req.body.movieId}`);
    }
    catch(err) {
        req.flash("error","Problem creating comment!")
        res.redirect(`/movies/${req.body.movieId}`);
    }
})

router.get('/:commentId/edit', checkCommentOwner ,async (req,res) => {
    try {
        const movie = await Movie.findById(req.params.id).exec()
        const comment = await Comment.findById(req.params.commentId).exec()
        res.render("comments_edit",{movie,comment});
    } catch (error) {
        res.redirect("back");
    }
})

router.put('/:commentId', checkCommentOwner ,async (req,res) => {
    try {
        const comment = await Comment.findByIdAndUpdate(req.params.commentId, {text: req.body.text}, {new:true});
        req.flash("In","Comment edited!");
        res.redirect(`/movies/${req.params.id}`);
    } catch (error) {
        req.flash("error","Problem editing comment!")
        res.send("back");
    }
})

router.delete('/:commentId', checkCommentOwner , async (req,res) => {
    try {
        const comment = await Comment.findByIdAndDelete(req.params.commentId);
        req.flash("success","Comment deleted!");
        res.redirect(`/movies/${req.params.id}`);
    } catch (error) {
        console.log(error);
        res.send("Broken!!!!!!!!!");
    }
})

module.exports = router;