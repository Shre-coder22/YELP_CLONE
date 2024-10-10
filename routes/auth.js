const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');

router.get('/signup', (req,res) => {
    res.render('signup')
});

router.post('/signup', async (req,res) => {
    try {
        const newUser = await User.register(new User({
            username: req.body.username,
            email: req.body.email
        }), req.body.password)

        req.flash("success",`Signed you up as ${newUser.username}`)

        passport.authenticate('local')(req,res, () => {
            res.redirect('/movies');
        });
    } catch (error) {
        console.log(error);
    }
});

router.get('/login', (req,res) => {
    res.render('login');
});

router.post('/login', passport.authenticate('local' , {
    successRedirect: '/movies',
    failureRedirect: '/login',
    failureFlash: true,
    successFlash: "Logged in successfully"
}));

router.post('/login', (req,res) => {
    req.logout();
    req.flash("success","Logged out!!")
    res.redirect('/movies');
});

router.get('/logout', (req,res) => {
    req.logout();
    res.redirect('/movies');
})

module.exports = router;