const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const morgan = require('morgan');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const expressSession = require('express-session'); 

const config = require('./config');

const movieRoutes = require('./routes/movies')
const commentRoutes = require('./routes/comments')
const mainRoutes = require('./routes/index')
const authRoutes = require('./routes/auth')

const Movie = require('./models/movies');
const Comment = require('./models/comment');
const User = require('./models/user');
 
mongoose.connect(config.db.connection);


app.set('view engine','ejs');
app.use(express.static('public'));
app.use(morgan('tiny'))
app.use(bodyParser.urlencoded({extended:true})); 
app.use(methodOverride('_method'));
app.use(expressSession({
    secret: "jodbolte",
    resave: false,
    saveUninitialized: false
}));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new localStrategy(User.authenticate()));

app.use((req,res,next) => {
    res.locals.user = req.user;
    res.locals.errorMessage = req.flash("error");
    res.locals.successMessage = req.flash("success");
    next();
})

app.use("/",mainRoutes);
app.use("/",authRoutes); 
app.use("/movies", movieRoutes);
app.use("/movies/:id/comments", commentRoutes);

app.listen(3000,(req,res) => {
    console.log("yelp_clone is running ....");
})