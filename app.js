//------------------------------ACQUIRE ALL PACKAGES/CONSTANTS---------------------------------------------
const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");

const app = express();

//all ejs files inside views folder
app.set('view engine', 'ejs');

//no seperate body parser is needed, all static files inside public(CSS,images)
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));



//-------------------------CONNECT TO DB & CREATE COLLECTION SCHEMA-------------------------------------

//connect to mongodb localHost
mongoose.connect("mongodb://localhost:27017/wikiDB", { useNewUrlParser: true });

//Create Article collection
const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("Article", articleSchema);



//-----------------------------GET AND POST CALLS------------------------------------------------


//----------------Requests targeting all articles-----------------------------------
app.route("/articles")

    .get(function (req, res) {

        Article.find({}, function (err, foundArticles) {

            if (!err) {
                res.send(foundArticles);
            }
            else {
                res.send(err);
            }
        });
    })
    .post(function (req, res) {


        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        });

        newArticle.save(function (err) {
            if (!err) {
                res.send("Successfully added a new article")
            } else {
                res.send(err);
            }
        });
    })
    .delete(function (req, res) {

        Article.deleteMany(function (err) {
            if (!err) {
                res.send("Successfully deleted all articles");
            } else {
                res.send(err);
            }
        });
    });

//----------------Requests targeting a specific article-----------------------------------
app.route("/articles/:articleTitle")

    .get(function(req,res){

        articleTitle= req.params.articleTitle;
        Article.findOne(
            {title : articleTitle},
            function(err,foundArticle){

                if(foundArticle){
                    res.send(foundArticle);
                }else{
                    res.send("No articles matching with the title was found")
                }
            }
        );
    })

    .put(function(req,res){

        articleTitle= req.params.articleTitle;

        Article.updateOne(
            {title: articleTitle},
            {
                title: req.body.title,
                content: req.body.content
            },
            function(err){
                if(!err){
                    res.send("Successfully updated the article")
                }else{
                    res.send(err);
                }
            }
        );
    })

    .patch(function(req,res){

        articleTitle= req.params.articleTitle;

        Article.updateOne(
            {title: articleTitle},
            {$set: req.body},
            function(err){
                if(!err){
                    res.send("Successfully updated the article")
                }else{
                    res.send(err);
                }
            }
        );

    })

    .delete(function(req,res){

        articleTitle= req.params.articleTitle;
        Article.deleteOne(
            {title: articleTitle},
            function(err){
                if(!err){
                    res.send("Successfully deleted the article")
                }else{
                    res.send(err);
                }
            }
        );
    });

//-----------------------------LISTEN AT PORT------------------------------------------------

app.listen(3000, function () {
    console.log("Server started on port successfully");
});

