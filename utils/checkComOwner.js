const Comment = require('../models/comment');

// Middleware to check if the user is the owner of the comment
const checkCommentOwner = async (req, res, next) => {
    if (req.isAuthenticated()) { // Check if the user is authenticated
        const comment = await Comment.findById(req.params.commentId).exec(); // Find the comment by ID
        if (comment.user.id.equals(req.user._id)) { // Check if the logged-in user owns the comment
            next(); // Proceed to the next middleware or route handler
        } else {
            req.flash("In", "You don't own the comment!"); // Flash message for ownership error
            res.redirect("back"); // Redirect if not the owner
        }
    } else {
        req.flash("error", "Not logged in buddy!"); // Flash message for authentication error
        res.redirect('/login'); // Redirect to login if not authenticated
    }
};

module.exports = checkCommentOwner; // Export the middleware
