// Middleware to check if the user is authenticated
const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) { // Check if the user is authenticated
        return next(); // Proceed to the next middleware or route handler
    } else {
        req.flash("error", "You are not logged in!"); // Flash message for authentication error
        res.redirect('/login'); // Redirect to login if not authenticated
    }
};

module.exports = isLoggedIn; // Export the middleware
