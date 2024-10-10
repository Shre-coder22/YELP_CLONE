const Movie = require('../models/movies');

const checkMovieOwner = async (req,res,next) => {
    if(req.isAuthenticated()) {
        const movie = await Movie.findById(req.params.id).exec()
        if(movie.owner.id.equals(req.user._id) ) {
            next();
        }
        else {
            req.flash("In","You dont own the movie!");
            res.redirect("back");
        }
    }
    else {
        req.flash("error","Not logged in buddy!");
        res.redirect('/login');
    }
}

module.exports = checkMovieOwner;