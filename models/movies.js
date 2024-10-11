const mongoose = require('mongoose');

// Define the schema for movies
const movieSchema = new mongoose.Schema({
    title: String,
    description: String,
    image: String,
    director: String,
    genre: [String],
    color: Boolean,
    date: Date,
    owner: { // Owner details
        id: { // Reference to the User model
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    upvotes: [String], // Users who upvoted
    downvotes: [String] // Users who downvoted
});

// Export the Movie model
module.exports = mongoose.model("Movie", movieSchema);
