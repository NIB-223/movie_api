const bcrypt = require('bcrypt');
//require mongose package and defines models(file)
const mongoose = require('mongoose');



//connects mongoose to the db
mongoose.connect('mongodb+srv://usermane21:CdXk3W9UNAH16IXzv7Ca@mycluster.62uci.mongodb.net/myFlixDB?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });


//define schema
let movieSchema = mongoose.Schema({
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

userSchema.statics.hashPassword = (password) => {
    return bcrypt.hashSync(password, 10);
};

userSchema.methods.validatePassword = function (password) {
    return bcrypt.compareSync(password, this.Password);
};


//create actual models
let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);


//exports models
module.exports.Movie = Movie;
module.exports.User = User;



