
//Cors
const cors = require('cors');
let allowedOrigins = [
    'http://localhost:8080',
    'http://testsite.com',
    'http://localhost:1234',
    'https://myflix20.netlify.app',
    'http://localhost:4200',
    'http://localhost:4200/movies',
    "http://localhost:4200",
    "http://localhost:4200/",
    "https://localhost:4200",
    "https://drxl95.github.io/myFlix-Angular/",
    "https://drxl95.github.io",
];


const mongoose = require('mongoose');
const Models = require('./models.js');

//these refer to the model names 
const Movies = Models.Movie;
const Users = Models.User;

//express validator
const { check, validationResult } = require('express-validator');

const { response } = require('express');
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');

// bodyParser = require('body-parser');
uuid = require('uuid');


const app = express();

//using common format json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// CORS in express
app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) { // If a specific origin isn’t found on the list of allowed origins
            let message = 'The CORS policy for this application doesn’t allow access from origin ' + origin;
            return callback(new Error(message), false);
        }
        return callback(null, true);
    }
}));



//import auth.js to index.js
let auth = require('./auth')(app);

//require and import passport
const passport = require('passport');
require('./passport');


//Welcome message
app.get("/", (req, res) => {
    res.send('Hello and Welcome to myFlix!');
});

/**
 * Get a list of all movies
 * @method GETmovies
 * @returns {Array} - returns list of movies 
 * @requires authentication JWT
 */
app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.find()
        .then((movies) => {
            res.status(201).json(movies);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send('Error: ' + err);
        });
});


/** 
 * Get data about a movie by title
 * @method GETmoviebytitle
 * @param {string} Title - title of the movie
 * @returns {object} - returns the movie with a specific title
 * @requires authentication JWT
 */
app.get('/movies/:Title', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.findOne({ Title: req.params.Title })
        .then((movie) => {
            res.json(movie);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});


/**
 * Get movies by genre name 
 * @method GETmoviesbygenre
 * @param {string} Name - name of the genre
 * @returns {Array} - returns a list of movies by genre name
 * @requires authentication JWT
 */
app.get('movies/genres/:Name', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.find({ Title: req.params.Name }) //what documents you want  the systemt to find
        .then((movie) => {
            res.status(201).json(movie.Title);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});


/**
 * Get data about genre by name 
 * @method GETgenreInfoByName
 * @param {string} Name name of the genre
 * @returns {object} - returns and object containing information about a genre
 * @requires authentication JWT
 */
app.get('/genres/:Name', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.findOne({ 'Genre.Name': req.params.Name })
        .then((movie) => {
            res.json(movie.Genre.Description); //only sends back object that contains genre's info
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});


/**
 * get data about director by name
 * @method GETdirectorDataByName
 * @param {string} Name Name of Director
 * @returns {object} - returns an object containing information about a director
 * @requires authentication JWT
 */
app.get('/directors/:Name', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.findOne({ 'Director.Name': req.params.Name })
        .then((movie) => {
            res.json(movie.Director);//only sends back the object that contains director's info
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

/**
 * get all users
 * @method GETallUsers
 * @returns {Array} - returns an array of all users 
 * @requires authentication JWT
 */
app.get('/users', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.find()
        .then((users) => {
            res.status(201).json(users);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

/**
 * get a user by username
 * @method GETuserByUsername
 * @param {string} Username Name of user's acct.
 * @returns {object} - returns an object containing user info
 * @requires authentication JWT
 */
app.get('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOne({ Username: req.params.Username })
        .then((user) => {
            res.json(user);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});


/**
 * registers user (POST)
 * @method RegisterUser
 * @param {string} Username - user chooses allowed username
 * @param {string} Password - user chooses allowed password
 * @param {string} Email - user enters valid email
 * @param {string} Birthday - user enters their birthdate
 * @returns {object} - adds user info (account) to database
 */
app.post('/users',
    // Validation (express-validator) logic here for request
    //you can either use a chain of methods like .not().isEmpty()
    //which means "opposite of isEmpty" in plain english "is not empty"
    //or use .isLength({min: 5}) which means
    //minimum value of 5 characters are only allowed
    [
        check('Username', 'Username is required').isLength({ min: 5 }),
        check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
        check('Password', 'Password is required').not().isEmpty(),
        check('Email', 'Email does not appear to be valid').isEmail()
    ], (req, res) => {

        // check the validation object for errors
        let errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        let hashedPassword = Users.hashPassword(req.body.Password);
        Users.findOne({ Username: req.body.Username }) // Search to see if a user with the requested username already exists
            .then((user) => {
                if (user) {
                    //If the user is found, send a response that it already exists
                    return res.status(400).send(req.body.Username + ' already exists');
                } else {
                    Users
                        .create({
                            Username: req.body.Username,
                            Password: hashedPassword,
                            Email: req.body.Email,
                            Birthday: req.body.Birthday
                        })
                        .then((user) => { res.status(201).json(user) })
                        .catch((error) => {
                            console.error(error);
                            res.status(500).send('Error: ' + error);
                        });
                }
            })
            .catch((error) => {
                console.error(error);
                res.status(500).send('Error: ' + error);
            });
    });


/**
 * updates user info (PUT)
 * @method UpdateUserInfo
 * @param {string} Username - user changes username
 * @param {string} Password - user changes password
 * @param {string} Email - user changes email
 * @param {string} Birthday - user changes birthdate
 * @returns {object} - changes user info in database
 * @requires authentication JWT
 */
app.put('/users/:Username',
    [
        check('Username', 'Username is required').isLength({ min: 5 }),
        check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
        check('Password', 'Password is required').not().isEmpty(),
        check('Email', 'Email does not appear to be valid').isEmail()
    ],
    passport.authenticate('jwt', { session: false }),
    (req, res) => {

        //check the validation object for errors
        let errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() })
        }

        let hashedPassword = Users.hashPassword(req.body.Password); //Hash any password entered by the user when registering before storing it in the MongoDB database

        Users.findOneAndUpdate({ Username: req.params.Username }, {
            $set:
            {
                Username: req.body.Username,
                Password: hashedPassword,
                Email: req.body.Email,
                Birthday: req.body.Birthday
            }
        },
            { new: true }, // This line makes sure that the updated document is returned
            (err, updatedUser) => {
                if (err) {
                    console.error(err);
                    res.status(500).send('Error: ' + err);
                } else {
                    res.json(updatedUser);
                }
            });
    });


/**
 * user adds movie to favorites list (POST)
 * @method ADDfavMovie
 * @param {String} Username name of user's account
 * @param {String} movieID identication code for movie
 * @return {Array} - list of favorite movies
 * @requires authentication JWT 
 */
app.post('/users/:Username/FavoriteMovies/:movieID', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.Username }, {
        $push: { FavoriteMovies: req.params.movieID }
    },
        { new: true }, //makes sure that the updated document is returned
        (err, updatedUser) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error: ' + err);
            } else {
                res.json(updatedUser);
            }
        });
});


/**
 * user removes movie from favorites list (DELETE)
 * @method DELETEfavMovie
 * @param {String} Username name of user's account
 * @param {String} movieID identication code for movie
 * @requires authentication JWT 
 */
app.delete('/users/:Username/FavoriteMovies/:movieID', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.Username }, {
        $pull: { FavoriteMovies: req.params.movieID }
    },
        { new: true }, //makes sure that the updated document is returned
        (err, updatedUser) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error: ' + err);
            } else {
                res.json(updatedUser);
            }
        });
});

/**
 * user deletes account (DELETE)
 * @method DELETEaccount
 * @param {String} Username name of user's account 
 * @requires authentication JWT 
 */
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOneAndRemove({ Username: req.params.Username })
        .then((user) => {
            if (!user) {
                res.status(400).send(req.params.Username + ' was not found');
            } else {
                res.status(200).send(req.params.Username + ' was deleted.');
            }
        })
        .catch((er) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});


//sending static files
app.use(express.static('public'));

//error handling
app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(500).send('Error found.');
});

//listen for requests
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
    console.log('Listening on Port ' + port);
});