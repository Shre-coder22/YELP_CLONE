const express = require('express');
const router = express.Router();
const Movie = require('../models/movies');
const Comment = require('../models/comment');
const isLoggedIn = require('../utils/isLoggedin');
const checkMovieOwner = require('../utils/checkOwner');
const User = require('../models/user'); // Import the user schema
const mongoose = require('mongoose');

// Render all movies
router.get('/', async (req, res) => {
    try {
        const movies = await Movie.find().exec();
        res.render("movies", { movies });
    } catch (err) {
        console.log(err);
    }
});

// Render movies by genre
router.get("/genre/:genre", async (req, res) => {
    const validGenres = ['action', 'sci-fi', 'horror', 'fantasy', 'romance', 'non-fiction', 'drama', 'thriller', 'comedy'];
    const lowerWords = req.params.genre.toLowerCase();
    if (validGenres.includes(lowerWords)) {
        const movies = await Movie.find({ genre: req.params.genre }).exec();
        res.render('movies', { movies });
    } else {
        res.send('Please enter a valid genre!');
    }
});

// Create a new movie
router.post('/', isLoggedIn, async (req, res) => {
    const newMovie = {
        title: req.body.title,
        description: req.body.description,
        image: req.body.image,
        director: req.body.director,
        date: req.body.date,
        color: !!req.body.color,
        genre: req.body.genre,
        owner: {
            id: req.user._id,
            username: req.user.username 
        },
        upvotes: [req.user.username],
        downvotes: [req.user.username]
    };

    try {
        const movie = await Movie.create(newMovie);
        req.flash("success", "Movie added successfully.");
        res.redirect('/movies/' + movie._id);
    } catch (err) {
        req.flash("error", "Problem adding movie!");
        res.redirect("/movies");
    }
});

// Handle voting
router.post("/vote", isLoggedIn, async (req, res) => {
    const movie = await Movie.findById(req.body.movieId);
    const alreadyUpvoted = movie.upvotes.indexOf(req.user.username);
    const alreadyDownvoted = movie.downvotes.indexOf(req.user.username);
    let response = {};
    let newScore;

    if (alreadyDownvoted === -1 && alreadyUpvoted === -1) {
        if (req.body.voteType === 'up') {
            movie.upvotes.push(req.user.username);
            newScore = movie.upvotes.length - movie.downvotes.length;
            response = { message: 'Upvoted!', code: 1, score: newScore };
        } else if (req.body.voteType === 'down') {
            movie.downvotes.push(req.user.username);
            newScore = movie.upvotes.length - movie.downvotes.length;
            response = { message: 'Downvoted!', code: -1, score: newScore };
        } else {
            response.message = 'Error voting!';
        }
        await movie.save();
    } else if (alreadyUpvoted >= 0) {
        if (req.body.voteType === 'up') {
            movie.upvotes.splice(alreadyUpvoted, 1);
            newScore = movie.upvotes.length - movie.downvotes.length;
            response = { message: 'Upvote removed!', code: 0, score: newScore };
        } else if (req.body.voteType === 'down') {
            movie.upvotes.splice(alreadyUpvoted, 1);
            movie.downvotes.push(req.user.username);
            newScore = movie.upvotes.length - movie.downvotes.length;
            response = { message: 'Downvoted!', code: -1, score: newScore };
        } else {
            response = { message: 'err', code: "err" };
        }
        await movie.save();
    } else if (alreadyDownvoted >= 0) {
        if (req.body.voteType === 'up') {
            movie.downvotes.splice(alreadyDownvoted, 1);
            movie.upvotes.push(req.user.username);
            newScore = movie.upvotes.length - movie.downvotes.length;
            response = { message: 'Upvoted!', code: 1, score: newScore };
        } else if (req.body.voteType === 'down') {
            movie.downvotes.splice(alreadyDownvoted, 1);
            newScore = movie.upvotes.length - movie.downvotes.length;
            response = { message: 'Downvote removed!', code: 0, score: newScore };
        } else {
            response.message = 'Error 3';
            response = { message: 'err!', code: 'err', score: 'err' };
        }
        await movie.save();
    } else {
        response = { message: 'ERROR!', code: 'err', score: 'err' };
    }
    
    console.log("New score sent to client:", newScore); 
    res.json(response);
    console.log(response);
});

// Render form to create a new movie
router.get('/new', isLoggedIn, (req, res) => {
    res.render("movies_new");
});

// Search for movies
router.get('/search', async (req, res) => {
    try {
        const movies = await Movie.find({
            $text: {
                $search: req.query.word
            }
        });
        res.render('movies', { movies });
    } catch (error) {
        console.log(error);
        res.send('Broken search');
    }
});

// Show details of a movie
router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send('Invalid ID');
        }
        const foundMovie = await Movie.findById(id).exec();
        const comments = await Comment.find({ movieId: foundMovie._id }).exec();
        res.render("movie_show", { foundMovie, comments });
    } catch (error) {
        console.log(error);
    }
});

// Render edit form for a movie
router.get('/:id/edit', checkMovieOwner, async (req, res) => {   
    const movie = await Movie.findById(req.params.id).exec();
    res.render("movies_edit", { movie });
});

// Update a movie
router.put("/:id", checkMovieOwner, async (req, res) => {
    const movieBody = {
        title: req.body.title,
        description: req.body.description,
        image: req.body.image,
        director: req.body.director,
        date: req.body.date,
        color: !!req.body.color,
        genre: req.body.genre,
        owner: {
            id: req.user._id,
            username: req.user.username 
        }
    };
    const movieId = req.params.id.trim();
    try {
        const movie = await Movie.findByIdAndUpdate(movieId, movieBody, { new: true }).exec();
        req.flash("In", "Movie updated!");
        res.redirect(`/movies/${movieId}`);
    } catch (error) {
        console.log(error);
        req.flash("error", "Error updating movie.");
        res.redirect("/movies");
    }
});

// Delete a movie
router.delete('/:id', checkMovieOwner, async (req, res) => {
    try {
        const deletedMovie = await Movie.findByIdAndDelete(req.params.id).exec();
        req.flash("In", "Movie deleted!");
        res.redirect('/movies');
    } catch (err) {
        req.flash("error", "Error deleting movie.");
        res.redirect("back");
    }
});

// Toggle watched status for a movie
router.post('/:id/toggle-watch', async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/login'); // Ensure user is logged in
    }

    try {
        const user = await User.findById(req.user._id);
        const movieId = req.params.id.trim();

        // Check if the movie is already in the watchedMovies array
        const isWatched = user.watchedMovies.includes(movieId);

        if (isWatched) {
            // Remove the movie from the watched list
            user.watchedMovies.pull(movieId);
        } else {
            // Add the movie to the watched list
            user.watchedMovies.push(movieId);
        }

        await user.save();
        res.status(200).json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Render recommended movies based on genre
router.get('/:id/recommended_movies', async (req, res) => {
    const movieId = req.params.id.trim();
    try {
        const movie = await Movie.findById(movieId);
        const recommendedMovies = await Movie.find({
            genre: { $in: movie.genre },  // Match movies with the same genre
            _id: { $ne: movie._id }       // Exclude the current movie
        });

        res.render('recommended_movies', { recommendedMovies }); // Render the recommended movies page
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router; // Export the router
