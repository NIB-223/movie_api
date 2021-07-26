//require mongose package and defines models(file)
const mongoose = require('mongoose');
const Models = require('./models.js');

//these refer to the model names 
const Movies = Models.Movie;
const Users = Models.User;

//connects mongoose to the db
mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true });

//define schema
let moveiSchema = mongoose.Schema({
    Title: { type: String, required: true },
    Description: { type: String, required: true },
    Genre: {
        Name: String,
        Description: String
    },
    Director: {
        Name: String,
        Bio: String
    },
    Actors: [String],
    ImagePath: String,
    Featured: Boolean
});

//define schema
let userSchema = mongoose.Schema({
    Username: { type: String, required: true },
    Password: { type: String, required: true },
    Email: { type: String, required: true },
    Birthday: Date,
    FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }]
});


//create actual models
let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);

//exports models
module.exports.Movie = Movie;
module.exports.User = User;



