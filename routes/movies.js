const express = require('express');
const router = express.Router();
const Movie = require('../models/movies');
const Comment = require('../models/comment');
const isLoggedIn = require('../utils/isLoggedin');
const checkMovieOwner = require('../utils/checkOwner');


router.get('/', async (req,res) => {
    try{
        const movies = await Movie.find().exec()
        res.render("movies",{movies});
    }catch(err){
        console.log(err);
    }
});

router.get("/genre/:genre", async (req,res) => {
    const validGenres = ['action','sci-fi','horror','fantasy','romance','non-fiction','drama','thriller','comedy'];
    const lowerWords = req.params.genre.toLowerCase();
    if(validGenres.includes(lowerWords)){
        const movies = await Movie.find({genre: req.params.genre}).exec();
        res.render('movies',{movies});
    }else{
        res.send('Please enter a valid genre!');
    }
})

router.post('/', isLoggedIn ,async (req,res) => {
    console.log(req.body);
    const genre = req.body.genre.toLowerCase();
    const newMovie = {
        title:req.body.title,
        description:req.body.description,
        image:req.body.image,
        director:req.body.director,
        date:req.body.date,
        color:!!req.body.color,
        genre,
        owner: {
            id: req.user._id,
            username: req.user.username 
        }
    }

    try {
        const movie = await Movie.create(newMovie);
        req.flash("success","Movie added successfully.");
        res.redirect('/movies/'+ movie._id);

    } catch (err) {
        req.flash("error","Problem adding movie! ");
        res.redirect("/movies");
    }

})

router.get('/new', isLoggedIn , (req,res) => {
    res.render("movies_new");
})

router.get('/search', async(req,res) => {
    try {
        const movies = await Movie.find({
            $text: {
                $search: req.query.word
            }
        })
        res.render('movies',{movies})
    } catch (error) {
        console.log(error);
        res.send('Broken search');
    }
})

router.get('/:id',async (req,res) => {
    try {
        const foundMovie = await Movie.findById(req.params.id).exec()
        const comments = await Comment.find({movieId:req.params.id})
        res.render("movie_show",{foundMovie,comments})
    } catch (error) {
        console.log(error);
    }
})

router.get('/:id/edit', checkMovieOwner , async (req,res) => {   
    const movie = await Movie.findById(req.params.id).exec()
    res.render("movies_edit",{movie})
        
})

router.put("/:id", checkMovieOwner , async (req,res) => {
    const genre = req.body.genre.toLowerCase();
    const movieBody = {
        title:req.body.title,
        description:req.body.description,
        image:req.body.image,
        director:req.body.director,
        date:req.body.date,
        color:!!req.body.color,
        genre,
        owner: {
            id: req.user._id,
            username: req.user.username 
        }
    }
    try {
        const movie = await Movie.findByIdAndUpdate(req.params.id,movieBody,{new:true}).exec()
        req.flash("In","Movie updated yo!");
        res.redirect(`/movies/${req.params.id}`);
    } catch (error) {
        console.log(error);
        req.flash("error","Error updating movie.");
        res.redirect("/movies");
    }
})

router.delete('/:id', checkMovieOwner , async (req,res) => {
    try{
        const deletedMovie = await Movie.findByIdAndDelete(req.params.id).exec()
        req.flash("In","Movie deleted buddy!");
        res.redirect('/movies')
    }catch(err) {
        req.flash("error","Error deleting movie.");
        res.redirect("back");
    }
})

module.exports = router;