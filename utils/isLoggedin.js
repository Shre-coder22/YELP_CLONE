const isLoggedIn = (req,res,next) => {
    if(req.isAuthenticated()) {
        return next();
    }
    else{
        req.flash("error", "You are not logged in!");
        res.redirect('/login');
    }
}

module.exports = isLoggedIn;
