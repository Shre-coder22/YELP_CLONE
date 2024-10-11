const express = require('express');
const router = express.Router({ mergeParams: true });
const Comment = require('../models/comment');
const Movie = require('../models/movies');
const isLoggedIn = require('../utils/isLoggedin');
const checkCommentOwner = require('../utils/checkComOwner');

// Render form to create a new comment
router.get('/new', isLoggedIn, (req, res) => {
    const movieId = req.params.id.trim();
    res.render("comments_new", { movie_id: movieId });
});

// Handle comment creation
router.post('/', isLoggedIn, async (req, res) => {
    const movieId = req.params.id.trim();
    try {
        const comment = await Comment.create({
            user: {
                id: req.user._id,
                username: req.user.username
            },
            text: req.body.text,
            movieId: movieId
        });
        req.flash("success", "Comment created!");
        res.redirect(`/movies/${req.body.movieId}`);
    } catch (err) {
        req.flash("error", "Problem creating comment!");
        res.redirect(`/movies/${req.body.movieId}`);
    }
});

// Render edit form for a specific comment
router.get('/:commentId/edit', checkCommentOwner, async (req, res) => {
    const movieId = req.params.id.trim();
    const comId = req.params.commentId.trim();
    try {
        const movie = await Movie.findById(movieId).exec();
        const comment = await Comment.findById(comId).exec();
        res.render("comments_edit", { movie, comment });
    } catch (error) {
        res.redirect("back");
    }
});

// Handle comment update
router.put('/:commentId', checkCommentOwner, async (req, res) => {
    const movieId = req.params.id.trim();
    const comId = req.params.commentId.trim();
    try {
        const comment = await Comment.findByIdAndUpdate(comId, { text: req.body.text }, { new: true });
        req.flash("success", "Comment edited!");
        res.redirect(`/movies/${movieId}`);
    } catch (error) {
        req.flash("error", "Problem editing comment!");
        res.redirect("back");
    }
});

// Handle comment deletion
router.delete('/:commentId', checkCommentOwner, async (req, res) => {
    try {
        await Comment.findByIdAndDelete(req.params.commentId);
        req.flash("success", "Comment deleted!");
        res.redirect(`/movies/${req.params.id}`);
    } catch (error) {
        console.log(error);
        res.send("Error occurred!");
    }
});

module.exports = router; // Export the router
