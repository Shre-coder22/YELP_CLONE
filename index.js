// ==================================================================>
// Import necessary modules
// ==================================================================>

const express = require('express'); // Web framework for Node.js
const app = express(); // Create an instance of Express
const bodyParser = require('body-parser'); // Middleware to parse request bodies
const mongoose = require('mongoose'); // MongoDB object modeling tool
const methodOverride = require('method-override'); // Middleware to allow HTTP verbs
const expressSession = require('express-session'); // Middleware for session management
const passport = require('passport'); // Middleware for authentication
const localStrategy = require('passport-local').Strategy; // Local authentication strategy
const flash = require('connect-flash'); // Middleware for flash messages

const config = require('./config'); // Import configuration file

// ==================================================================>
// Import route modules
// ==================================================================>

const movieRoutes = require('./routes/movies');
const commentRoutes = require('./routes/comments');
const mainRoutes = require('./routes/index');
const authRoutes = require('./routes/auth');

// ==================================================================>
// Import models
// ==================================================================>

const Movie = require('./models/movies');
const Comment = require('./models/comment');
const User = require('./models/user');

// ==================================================================>
// Connect to MongoDB database
// ==================================================================>

mongoose.connect(config.db.connection); // Use connection string from config

// ==================================================================>
// Set up view engine
// ==================================================================>

app.set('view engine', 'ejs'); // Use EJS for templating
app.use(express.static('public')); // Serve static files from the public directory

// ==================================================================>
// MIDDLEWARES
// ==================================================================>

// Middleware for parsing JSON and URL-encoded data
app.use(express.json({
    type: ['application/json', 'text/plain'] // Accept both JSON and plain text
}));
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: true })); // Use body-parser to parse URL-encoded bodies

// Method override middleware
app.use(methodOverride('_method')); // Allow using PUT and DELETE methods via a query parameter

// ==================================================================>
// Session management middleware
// ==================================================================>

app.use(expressSession({
    secret: "jodboltenbfalj2pqnfioa98hawldnalndabfadlnf9", // Secret for signing the session ID cookie
    resave: false, // Don't save session if unmodified
    saveUninitialized: false // Don't create session until something stored
}));

// Flash middleware
app.use(flash()); // Enable flash messages

// ==================================================================>
// Passport initialization and configuration
// ==================================================================>

app.use(passport.initialize()); // Initialize passport
app.use(passport.session()); // Use session for passport

// ==================================================================>
// Passport serialization and deserialization
// ==================================================================>

passport.serializeUser(User.serializeUser()); // Serialize user for session
passport.deserializeUser(User.deserializeUser()); // Deserialize user from session
passport.use(new localStrategy(User.authenticate())); // Use local strategy for authentication

// ==================================================================>
    // Middleware for setting local variables for templates
// ==================================================================>

app.use((req, res, next) => {
    res.locals.user = req.user; // Store user info in local variables for access in templates
    res.locals.errorMessage = req.flash("error"); // Store error messages
    res.locals.successMessage = req.flash("success"); // Store success messages
    res.locals.inMessage = req.flash("In"); // Store other messages
    next(); // Proceed to the next middleware
});

// ==================================================================>
    // Route setup
// ==================================================================>

app.use("/", mainRoutes); // Main application routes
app.use("/", authRoutes); // Authentication routes
app.use("/movies", movieRoutes); // Movie-related routes
app.use("/movies/:id/comments", commentRoutes); // Comment-related routes for specific movies

// ==================================================================>
    // Start the server
// ==================================================================>
app.listen(3000, (req, res) => {
    console.log("yelp_clone is running ...."); // Log message indicating the server is running
});
