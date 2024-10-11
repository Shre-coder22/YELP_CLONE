const mongoose = require('mongoose');

// Define the schema for comments
const commentSchema = new mongoose.Schema({
    user: {
        id: { // User's ID referencing the User model
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String // Username of the user posting the comment
    },
    text: String, // The text content of the comment
    movieId: { // ID of the movie this comment is associated with
        type: mongoose.Schema.Types.ObjectId,
        ref: "Movie"
    }
});
 
// Export the Comment model based on the commentSchema
module.exports = mongoose.model("Comment", commentSchema);
