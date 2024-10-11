const express = require('express');
const router = express.Router();
const isLoggedIn = require('../utils/isLoggedin');
const Movie = require('../models/movies'); // Adjust the path as necessary

// Render landing page
router.get('/', (req, res) => {
    res.render("landing");
});

// Render account page for authenticated users
router.get('/account', isLoggedIn, async (req, res) => {
    if (!req.user) { // Check if user is authenticated
        return res.redirect('/login'); // Redirect to login if not authenticated
    }

    try {
        // Fetch movies posted by the authenticated user using owner.id
        const movies = await Movie.find({ 'owner.id': req.user._id });
        res.render('account', { movies }); // Render account page with user's movies
    } catch (err) {
        res.status(500).send(err.message); // Handle errors
    }
});

module.exports = router; // Export the router
