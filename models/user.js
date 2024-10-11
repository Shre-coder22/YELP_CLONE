const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true }, // Required username field
    email: { type: String, required: true }, // Required email field
    watchedMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }] // Movies watched by the user
});

userSchema.plugin(passportLocalMongoose); // Add Passport-Local Mongoose plugin for authentication

const User = mongoose.model('User', userSchema); // Create the User model

module.exports = User; // Export the User model
