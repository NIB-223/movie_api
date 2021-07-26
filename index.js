
const { response } = require('express');
const express = require('express');

bodyParser = require('body-parser');
uuid = require('uuid');

const app = express();

//using common format json
app.use(bodyParser.json());

// Top Ten Movies Data
const movies = [
    {
        movieID: 01,
        title: 'Silence of the Lambs',
        director: 'Robert Jonathan Demme',
        genre: 'Thriller'
    },
    {
        movieID: 02,
        title: 'Philadelphia',
        director: 'Robert Jonathan Demme',
        genre: 'Drama'
    },
    {
        movieID: 03,
        title: 'War of the Worlds',
        director: 'Steven Spielberg',
        genre: 'Sci-Fi'
    },
    {
        movieID: 04,
        title: 'Step Brothers',
        director: 'Judd Apatow',
        genre: 'Comedy'
    },
    {
        movieID: 05,
        title: 'Bridesmaids',
        director: 'Judd Apatow',
        genre: 'Comedy'
    },
    {
        movieID: 06,
        title: 'Talladega Nights: The Ballad of Ricky Bobby',
        director: 'Judd Apatow',
        genre: 'Comedy'
    },
    {
        movieID: 07,
        title: 'Pulp Fiction',
        director: 'Quentin Tarantino',
        genre: 'Crime'
    },
    {
        movieID: 08,
        title: 'Kill Bill Vol. 1',
        director: 'Quentin Tarantino',
        genre: 'Action'
    },
    {
        movieID: 09,
        title: 'From Dusk Till Dawn',
        director: 'Quentin Tarantino',
        genre: 'Action'
    },
    {
        movieID: 010,
        title: 'Jurassic Park',
        director: 'Steven Spielberg',
        genre: 'Sci-Fi'
    },
]
//Get a list of all movies
app.get('/movies', (req, res) => {
    res.send('Here are 10 movies.');
    res.json(movies);
});

//Get data(descr, genre, director, imageURL, featured or no) by title
app.get('/movies/:title', (req, res) => {
    res.send('Successful GET request returning data for movie');
    res.json(movies.find((movie) => { return movies.title === req.params.title }));
});

//Get data about genre by title
app.get('/movies/genre/:title', (req, res) => {
    res.send('Successful GET request returning data genre');
    res.json(movies.find((movie) => { return movie.genre === req.params.genre }));
});

//get data about director by name
app.get('/movies/director/:name', (req, res) => {
    res.send('Successful GET request returning data on director.')
    res.json(movies.find((movie) => { return movie.director === req.params.director }));
});

//add user (regist)
app.post('/users/', (req, res) => {
    let newUser = req.body;

    if (!newUser.name) {
        const message = 'Missing name in request body';
        res.status(400).send(message);
    } else {
        newUser.id = uuid.v4();
        user.push(newUser);
        res.status(201).send(newUser);
        res.send('Account successfully created.')
    }
    res.send('Account successfully created.')
});

//user updates their info
app.put('/users/:Username', (req, res) => {
    res.send('The user\'s info has been updated.');
});

//user adds movie to favorites list
app.post('/users/:Username/FavoriteMovies/:movieID', (req, res) => {
    res.send('Movie added to favorites list');
});

//user removes movie from favorites list
app.delete('/users/:Username/FavoriteMovies/:movieID', (req, res) => {
    res.send('movie removed from favorites list');
});

//user deregisters
app.delete('/users/:Username', (req, res) => {
    res.send('user\'s account remvoed')
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