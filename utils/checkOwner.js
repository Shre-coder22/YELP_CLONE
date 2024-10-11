const Movie = require('../models/movies');

// Middleware to check if the user is the owner of the movie
const checkMovieOwner = async (req, res, next) => {
    const movieId = req.params.id.trim(); // Get the movie ID from the request parameters
    if (req.isAuthenticated()) { // Check if the user is authenticated
        const movie = await Movie.findById(movieId).exec(); // Find the movie by ID
        if (movie.owner.id.equals(req.user._id)) { // Check if the logged-in user owns the movie
            next(); // Proceed to the next middleware or route handler
        } else {
            req.flash("In", "You don't own the movie!"); // Flash message for ownership error
            res.redirect("back"); // Redirect if not the owner
        }
    } else {
        req.flash("error", "Not logged in buddy!"); // Flash message for authentication error
        res.redirect('/login'); // Redirect to login if not authenticated
    }
};

module.exports = checkMovieOwner; // Export the middleware
