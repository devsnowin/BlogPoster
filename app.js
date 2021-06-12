const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const lib = require('thoughts');
const mongoose = require('mongoose');

const app = express();

const port = 3000;

//Variables
let thought = "Whether sharing your expertise, breaking news, or whatever’s on your mind, you’re in good company on Blogger. Discover the thoughts of various people like you!";

const posts = [];

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'));

//Connecting mongoDB 

mongoose.connect("mongodb://localhost:27017/blogposterDB", {useNewUrlParser: true, useUnifiedTopology: true});

//creating new schema

const postsSchema = new mongoose.Schema({
    title: String,
    body: String
});

//creating a model 

const Post = mongoose.model("Post", postsSchema);


//Home Page
app.get("/", (req, res) => {

    Post.find({}, (err, foundedPost) => {
        
            res.render('home', { thought: thought, posts: foundedPost });

    });
    
});

//About Page
app.get("/about", (req, res) => {
    res.render('about');
});

// Contact Page
app.get("/contact", (req, res) => {
    res.render('contact',)

});

//Compose Page
app.get("/compose", (req, res) => {
    res.render('compose');
});

//composing post 
app.post("/", (req, res) => {
    const title = req.body.titleText;
    const body = req.body.plainText;

    if (title.length != 0 && body.length != 0) {

        const post = new Post({
            title: title,
            body: body
        });

        post.save();
        res.redirect("/");

    }
    else {
        res.redirect("/compose");
    }

});

app.get("/posts/:head", (req, res) => {
    const postName = req.params.head;

    Post.find({}, (err, foundedPost) => {

        if (!err) {
            foundedPost.forEach((post) => {
                if (_.lowerCase(postName) === _.lowerCase(post.title)) {
                    res.render('post', {
                        title: post.title,
                        body: post.body
                    });
                }
            });
        }
        else {
            console.log("Error in finding post page.");
        }
        
    });
});

//Listening to port 3000 (Runs the server)
app.listen(port, () => {
    console.log(`Server started at port ${port}.`);
});