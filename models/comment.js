const mongoose = require('mongoose');
const Movie = require('../models/movies');

const commentSchema = new mongoose.Schema({
    user: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    text:String,
    movieId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Movie"
    }
});

const Comment = mongoose.model("comment", commentSchema);

module.exports = Comment;