const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static("public"));

var db = mongoose.connect('mongodb://localhost:27017/wikiDB');

const articleSchema = {
    title : String,
    content : String
};

const Article = mongoose.model("Article", articleSchema);

/////////////////////// Request Targeting all Articles///////////////////////

// chained route 
app.route("/articles")

  .get(async function(req, res) {
    try {
      const foundArticles = await Article.find();
      console.log(foundArticles);
      res.send(foundArticles); // Send the foundArticles as the response
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error"); // Handle the error and send an appropriate response
    }
  })

  .post(async function(req, res){
    const newArticle = new Article({
      title : req.body.title,
      content : req.body.content
    });
    newArticle.save(function(err){
      if (!err){
        res.send("Successfully added a new article.");
      } else {
        res.send(err);
      }
    });
  })

  .delete(async function(req, res){
    try{
      await Article.deleteMany();
      res.send("Successfully deleted all the articles.");
      } catch(err){
      res.send(err);
    }
  });


/////////////////////// Request Targeting a specific Articles///////////////////////

  app.route("/articles/:articleTitle")
  .get(async function(req,res){
    try{
      const foundArticle = await Article.findOne(
        { title: req.params.articleTitle }
      )
      if(foundArticle){
        res.send(foundArticle);
      } else {
        res.send("NO articles matching that title was found.");
      }
    } catch(err){
      res.send(err);
    }
    })
    .put(async function(req, res){
      try{
        await Article.updateOne(
          { title: req.params.articleTitle }, // condition
          { title : req.body.title, content : req.body.content} //updated value
        );
        res.send("Successfully updated a article.");
      } catch(err){
        res.send(err);
      }
    })

  // only updated the filed where user wants to update
    .patch(async function(req, res){
      try{
        await Article.updateOne(
          { title: req.params.articleTitle }, // condition
          { $set: req.body } //updated value
        );
        res.send("Successfully updated a article.");
      }catch(err){
        res.send(err);
      }
    })

    .delete(async function(req, res){
      try{
        await Article.deleteOne(
          { title: req.params.articleTitle }
        )
        res.send("Successfully deleted a article.")
      } catch(err){
        res.send(err);
      }
    });
app.listen(3000, function(){
    console.log("Server started on port 3000");
});