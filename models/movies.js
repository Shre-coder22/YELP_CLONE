const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    title:String,
    description:String,
    image:String,
    director:String,
    genre:String,
    color:Boolean,
    date:Date,
    owner: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});

movieSchema.index({
    '$**':'text'
});

const Movie = mongoose.model("movie", movieSchema);

module.exports = Movie;