
const { response } = require('express');
const express = require('express');
const morgan = require('morgan');
bodyParser = require('body-parser'),
    uuid = require('uuid');

const app = express();

//using common format in morgan and json
app.use(morgan('common'));
app.use(bodyParser.json());

// Top Ten Movies Data
const movies = [
    {
        title: 'A Clockwork Orange',
        director: 'Stanley Kubrick',
        genre: 'Crime/Drama'
    },
    {
        title: 'Shawshank Redemption',
        director: 'Frank Darabont',
        genre: 'Crime/Drama'
    },
    {
        title: 'Saving Private Ryan',
        director: 'Steven Spielberg',
        genre: 'War/Action'
    },
    {
        title: 'Willy Wonka and the Chocolate Factory',
        director: 'Mel Stuart',
        genre: 'Family/Fantasy'
    },
    {
        title: 'Don\'t Breathe',
        director: 'Fede Álvarez',
        genre: 'Horror/Thriller'
    },
    {
        title: 'Deliverance',
        director: 'John Booman',
        genre: 'Adventurw/Drama'
    },
    {
        title: 'Disturbia',
        director: 'DJ. Caruso',
        genre: 'Thriller'
    },
    {
        title: 'Insidious',
        director: 'James Wan',
        genre: 'Horror'
    },
    {
        title: 'Rudy',
        director: 'David Anspaugh',
        genre: 'Sports/Drama'
    },
    {
        title: 'Alone',
        director: 'John Hyams',
        genre: 'Psychological Horror'
    },
]
//Get a list of all movies
app.get('/', (req, res) => {
    res.send('Here are 10 movies.');
});

//Get data(descr, genre, director, imageURL, featured or no) by title
app.get('/movies/title', (req, res) => {
    res.send('Successful GET request returning data for movie')
    res.json(movies.find((movie) => { return movie.title === req.params.title }));
});

//Get data about genre by title
app.get('/movies/genre', (req, res) => {
    res.send('Successful GET request returning data genre')
    res.json(movies.find((movie) => { return movie.genre === req.params.genre }));
});

//get data about director by name
app.get('/movies/:title/director/:name', (req, res) => {
    res.send('Successful GET request returning data on director.')
});

//add user (regist)
app.post('/user', (req, res) => {
    // let newUser = req.body;

    // if (!newUser.name) {
    //     const message = 'Missing name in request body';
    //     res.status(400).send(message);
    // } else {
    //     newUser.id = uuid.v4();
    //     user.push(newUser);
    //     res.status(201).send(newUser);
    //     res.send('Account successfully created.')
    // }
    res.send('Account successfully created.')
});

//user updates their info
app.put('/user/:info/:username', (req, res) => {
    res.send('The user\'s info has been updated.');
});

//user adds movie to favorites list
app.post('/user/:info/:favorites', (req, res) => {
    res.send('Movie added to favorites list');
});

//user removes movie from favorites list
app.delete('/user/:info/:favorites', (req, res) => {
    res.send('movie removed from favorites list');
});

//user deregisters
app.delete('/user', (req, res) => {
    res.send('user\'s account remvoed')
});

//users update their info 
app.put('/user')

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