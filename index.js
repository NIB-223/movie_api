
const { response } = require('express');
const express = require('express');
const morgan = require('morgan');

const app = express();

//using common format in morgan
app.use(morgan('common'));

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

app.get('/', (req, res) => {
    res.send('Here are 10 movies.');
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