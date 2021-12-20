//jshint esversion:6
require('dotenv').config(); // needs to be right at the top
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption'); // encrypt datas
const app = express();

console.log(process.env.API_KEY);

app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static('public'));
app.set('view engine', 'ejs');


// connection URL
mongoose.connect('mongodb://localhost:27017/userDB', {useNewUrlParser: true});

// Schema
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

// encryption - encrypt the Schema before you create a mongoose model 
userSchema.plugin(encrypt,{secret: process.env.SECRET, encryptedFields: ['password']}); // we only want to encrypt the password

// Moddel
const User = new mongoose.model('User', userSchema);


// home page
app.get('/', function(req, res){
    res.render('home');
});

// login page
app.get('/login', function(req, res){
    res.render('login');
});

// register
app.get('/register', function(req, res){
    res.render('register');
});

app.post('/register', function(req, res){
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });

    newUser.save(function(err){
        if(!err){
            console.log('Document saved successfully.');
            res.render('secrets'); // renders 👉🏽 /views/secrets.ejs 
        } else {
            console.log(err);
        }
    });
});

app.post('/login', function(req, res){

    const username = req.body.username;
    const password = req.body.password;


    User.findOne({email: username}, function(err, foundUser){
        if(err){
            console.log(err);
        } else {
            if(foundUser){
                if(foundUser.password === password){
                    res.render('secrets');
                }
            }
        }
    });

});

// listen to port 3000 
app.listen(3000, function(){
    console.log('Server started at port 3000.');
});