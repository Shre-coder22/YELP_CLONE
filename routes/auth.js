const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');

// Handle user signup
router.post('/signup', async (req, res) => {
    try {
        const newUser = await User.register(new User({
            username: req.body.username,
            email: req.body.email
        }), req.body.password);

        req.flash("success", `Signed you up as ${newUser.username}`);

        passport.authenticate('local')(req, res, () => {
            res.redirect('/movies'); // Redirect to movies after signup
        });
    } catch (error) {
        console.log(error);
    }
});

// Render the login page
router.get('/login', (req, res) => {
    res.render('login');
});

// Handle user login
router.post('/login', passport.authenticate('local', {
    successRedirect: '/movies',
    failureRedirect: '/login',
    failureFlash: true,
    successFlash: "Logged in successfully"
}));

// Handle user logout
router.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error("Logout error:", err);
            req.flash("error", "Error logging out");
            return res.redirect('/movies');
        }
        req.flash("success", "Logged out successfully!");
        res.redirect('/'); // Redirect to home after logout
    });
});

module.exports = router; // Export the router
