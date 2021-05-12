//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const lodash = require("lodash");
const ejs = require("ejs");
const mongoose = require("mongoose");

const aboutContent = "Hey! Myself Lakshay Maini,";
const aboutLine =
  " Welcome to my Personal Blog Website. This is made by NodeJs, ExpressJs and MongoDB.";
const contactContent =
  "For more projects you can visit my Github profile 'lakshh07'";
const contactLastLine = "Thanks For Visiting!!";

const app = express();

mongoose.connect(
  "mongodb+srv://admin-lakshay:hello123@cluster0.oekg8.mongodb.net/blogDB",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  }
);

const blogSchema = {
  title: String,
  content: String,
};

const Post = mongoose.model("Post", blogSchema);

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function (req, res) {
  Post.find({}, function (err, foundBlog) {
    res.render("home", {
      posts: foundBlog,
    });
  });
});

app.get("/about", function (req, res) {
  res.render("about", { aboutContent: aboutContent, aboutLine: aboutLine });
});

app.get("/contact", function (req, res) {
  res.render("contact", {
    contactContent: contactContent,
    contactLastLine: contactLastLine,
  });
});

app.get("/compose", function (req, res) {
  res.render("compose");
});
app.post("/composes", function (req, res) {
  const blog = new Post({
    title: req.body.postTitle,
    content: req.body.postBody,
  });

  blog.save(function (err) {
    if (!err) {
      res.redirect("/");
    }
  });
});

app.post("/delete", function (req, res) {
  const blogId = req.body.blogId;

  Post.findByIdAndRemove(blogId, function (err) {
    res.redirect("/");
  });
});

app.get("/posts/:postId", function (req, res) {
  let requestedId = req.params.postId;

  Post.findOne({ _id: requestedId }, function (err, post) {
    res.render("post", {
      storedTitle: post.title,
      storedContent: post.content,
      storedId: post._id,
    });
  });
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Server started Successfully");
});
