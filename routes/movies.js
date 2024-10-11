const express = require('express');
const router = express.Router();
const Movie = require('../models/movies');
const Comment = require('../models/comment');
const isLoggedIn = require('../utils/isLoggedin');
const checkMovieOwner = require('../utils/checkOwner');
const mongoose = require('mongoose');

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
});

router.post('/', isLoggedIn ,async (req,res) => {
    console.log(req.body);
    // const genre = req.body.genre.toLowerCase();
    const newMovie = {
        title:req.body.title,
        description:req.body.description,
        image:req.body.image,
        director:req.body.director,
        date:req.body.date,
        color:!!req.body.color,
        genre:req.body.genre,
        owner: {
            id: req.user._id,
            username: req.user.username 
        },
        upvotes: [req.user.username],
        downvotes: [req.user.username]
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

router.post("/vote", isLoggedIn,  async(req,res) => {
    const movie = await Movie.findById(req.body.movieId);
    const alreadyUpvoted = movie.upvotes.indexOf(req.user.username);
    const alreadyDownvoted = movie.downvotes.indexOf(req.user.username);
    let response = {};
    let newScore;
    
    if(alreadyDownvoted === -1 && alreadyUpvoted === -1){
        if(req.body.voteType === 'up'){
            movie.upvotes.push(req.user.username);
            newScore = movie.upvotes.length - movie.downvotes.length;
            response = {message: 'Upvoted!',code: 1,score:newScore};
            
        }else if(req.body.voteType === 'down'){
            movie.downvotes.push(req.user.username);
            newScore = movie.upvotes.length - movie.downvotes.length;
            response= {message: 'Downvoted!',code: -1,score:newScore};
            
        }else{
            response.message = 'Error voting!';
            
        }
        await movie.save();
    }else if(alreadyUpvoted >= 0){
        if(req.body.voteType === 'up'){
            movie.upvotes.splice(alreadyUpvoted, 1);
            newScore = movie.upvotes.length - movie.downvotes.length;
            response = {message: 'Upvote removed!',code: 0,score:newScore};

        }else if(req.body.voteType === 'down'){
            movie.upvotes.splice(alreadyUpvoted, 1);
            movie.downvotes.push(req.user.username);
            newScore = movie.upvotes.length - movie.downvotes.length;
            response = {message: 'Downvoted!',code: -1,score:newScore};
            
        }else{
            response = {message: 'err',code: "err"};
        }
        await movie.save();
    }else if(alreadyDownvoted >= 0){
        if(req.body.voteType === 'up'){
            movie.downvotes.splice(alreadyDownvoted, 1);
            movie.upvotes.push(req.user.username);
            newScore = movie.upvotes.length - movie.downvotes.length;
            response = {message: 'Upvoted!',code: 1,score:newScore};

        }else if(req.body.voteType === 'down'){
            movie.downvotes.splice(alreadyDownvoted, 1);
            newScore = movie.upvotes.length - movie.downvotes.length;
            response = {message: 'Downvote removed!',code: 0,score:newScore};
            
        }else{
            response.message = 'Error 3'
            response = {message: 'err!',code: 'err',score:'err'};
        }
        await movie.save();
    }else{
        response = {message: 'ERUR!',code: 'err',score:'err'};
    }
    console.log("New score sent to client:", newScore); 

    res.json(response);
    console.log(response);
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
});

router.get('/:id',async (req,res) => {
    try {
        const id = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send('Invalid ID');
        }
        const foundMovie = await Movie.findById(id).exec();
        const comments = await Comment.find({movieId:foundMovie._id}).exec();
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
    const movieBody = {
        title:req.body.title,
        description:req.body.description,
        image:req.body.image,
        director:req.body.director,
        date:req.body.date,
        color:!!req.body.color,
        genre:req.body.genre,
        owner: {
            id: req.user._id,
            username: req.user.username 
        }
    }
    const movieId = req.params.id.trim();
    try {
        const movie = await Movie.findByIdAndUpdate(movieId,movieBody,{new:true}).exec()
        req.flash("In","Movie updated yo!");
        res.redirect(`/movies/${movieId}`);
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