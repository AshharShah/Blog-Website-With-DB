//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
var lodash = require("lodash");
// our database connection
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/blogdb");

const homeStartingContent =
  "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent =
  "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent =
  "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

const blogSchema = new mongoose.Schema({
  title: String,
  body: String,
});
var blog = mongoose.model("blog", blogSchema, "blogstore");

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function (req, res) {
  blog.find({}, function (err, result) {
    res.render("home", {
      homeStartPara: homeStartingContent,
      postArr: result,
    });
  });
});

app.get("/posts/:title", (req, res) => {
  var postFound = false;

  const requestedBlog = req.params.title;

  blog.findOne({ title: requestedBlog }, function (err, result) {
    res.render("post", {
      postTitle: result.title,
      postBody: result.body,
    });
  });
});

app.get("/delete/:id", function (req, res) {
  blog.deleteOne({ title: req.params.id }, function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("Blog Deleted");
    }
  });
  res.redirect("/");
});

app.get("/about", function (req, res) {
  res.render("about", { aboutStartPara: aboutContent });
});

app.get("/contact", function (req, res) {
  res.render("contact", { contactStartPara: contactContent });
});

app.get("/compose", function (req, res) {
  res.render("compose");
});

app.post("/compose", function (req, res) {
  const newBlog = new blog({
    title: req.body.newTitle,
    body: req.body.newBody,
  });
  newBlog.save(function (err, blog) {
    if (err) return console.error(err);
    console.log("Blog Added");
  });
  res.redirect("/");
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
