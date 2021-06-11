//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true, useUnifiedTopology: true}));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/wikiDB',{useNewUrlParser: true, useUnifiedTopology: true});



const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
});

const articleSchema = new mongoose.Schema({
    title: String,
    content: String
});

const Article = mongoose.model("Article", articleSchema);




//////////////////// Requesting all the articles ////////////////////

app.route("/articles")
    .get(function(req, res){
        Article.find(function(err, foundArticles){
            if(!err){
                res.send(foundArticles);
            } else{
                res.send(err);
            }

        });
    })
    .post(function(req,res){

        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        });
        newArticle.save(function(err){
            if(!err){
                res.send("Successfully added new article.");
            }else{
                res.send(err);
            }
        });
    })
    .delete(function(req, res){
        Article.deleteMany(function(err){
            if(!err){
                res.send("Successfully deleted all articles.");
            }else{
                res.send(err);
            }
        });
    });




//////////////////// Requesting a specific article ////////////////////

app.route("/articles/:articleTitle")

    .get(function(req,res){
        const articleTitle = req.params.articleTitle;

        Article.findOne({title:articleTitle}, function(err, foundArticle){
            if(foundArticle){
                res.send(foundArticle);
            }else{
                res.send("No articles matching that title was found!");
            }
        });
    })
    
    .put(function(req, res){
        const articleTitle = req.params.articleTitle;

        Article.findOneAndUpdate(
            {title: articleTitle},
            {title: req.body.title, content: req.body.content},
            {overwrite: true},
            function(err){
                if(!err){
                    res.send("Successfully updated the article.");
                }
            });
    })

    .patch(function(req, res){
        const articleTitle = req.params.articleTitle;

        Article.findOneAndUpdate(
            {title: articleTitle},
            {$set: req.body},
            function(err){
                if(!err){
                    res.send("Successfully updated the article.")
                }
                else{
                    res.send(err);
                }
            }
        );
    })

    .delete(function(req,res){
        const articleTitle = req.params.articleTitle;

        Article.findOneAndDelete(
            {title: articleTitle},
            function(err){
                if(!err){
                    res.send("Successfully deleted the article.");
                }else{
                    res.send(err);
                }
            }
        );

    });








app.listen(3000, function(){
    console.log("Server started on port 3000");
});