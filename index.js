
const mongoose = require('mongoose');
const Models = require('./models.js');

//these refer to the model names 
const Movies = Models.Movie;
const Users = Models.User;


mongoose.connect('mongodb://localhost:27017/myFlixDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const { response } = require('express');
const express = require('express');
const morgan = require('morgan');

bodyParser = require('body-parser');
uuid = require('uuid');


const app = express();

//using common format json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send('Hello and Welcome to myFlix!');
});

//Get a list of all movies
app.get('/movies', (req, res) => {
    Movies.find()
        .then((movies) => {
            res.status(201).json(movies);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send('Error: ' + err);
        });
});

//Get data about a movie by title
app.get('/movies/:Title', (req, res) => {
    Movies.findOne({ Title: req.params.Title })
        .then((movie) => {
            res.json(movie);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

//Get data about genre by name
app.get('/genres/:Name', (req, res) => {
    Movies.findOne({ 'Genre.Name': req.params.Name })
        .then((movie) => {
            res.json(movie.Genre.Description); //only sends back object that contains director's info
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

//get data about director by name
app.get('/directors/:Name', (req, res) => {
    Movies.findOne({ 'Director.Name': req.params.Name })
        .then((movie) => {
            res.json(movie.director);//only sends back the object that contains director's info
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// Get all users
app.get('/users', (req, res) => {
    Users.find()
        .then((users) => {
            res.status(201).json(users);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// Get a user by username
app.get('/users/:Username', (req, res) => {
    Users.findOne({ Username: req.params.Username })
        .then((user) => {
            res.json(user);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});


//add user (regist)
app.post('/users/', (req, res) => {
    Users.findOne({ Username: req.body.Username })
        .then((user) => {
            if (user) {
                return res.status(400).send(req.body.Username + 'already exists');
            } else {
                Users
                    .create({
                        Username: req.body.Username,
                        Password: req.body.Password,
                        Email: req.body.Email,
                        Birthdate: req.body.Birthdate
                    })
                    .then((user) => { res.status(201).json(user) })
                    .catch((error) => {
                        res.status(500).send('Error: ' + error);
                    })
            }
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
        });
});

//user updates their info
app.put('/users/:Username', (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.Username }, {
        $set:
        {
            Username: req.body.Username,
            Password: req.body.Password,
            Email: req.body.Email,
            Birthdate: req.body.Birthdate
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

//user adds movie to favorites list
app.post('/users/:Username/FavoriteMovies/:movieID', (req, res) => {
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

//user removes movie from favorites list
app.delete('/users/:Username/FavoriteMovies/:movieID', (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.Username }, {
        $pull: { FavoriteMovies: req.params.movieID }
    },
        { new: true }, //makes sure that the updated document is returned
        (err, updatedUser) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error: ' + err);
            } else {
                res.json(updatedUser); l
            }
        });
});

//user deregisters
app.delete('/users/:Username', (req, res) => {
    Users.findOneAndRemove({ Username: req.params.Username })
        .then((user) => {
            if (!user) {
                res.status(400).sendZ(req.params.Username + ' was not found');
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
app.listen(8080, () => {
    console.log('Listening to port 8080');
});