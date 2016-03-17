var express = require("express");
var app = express();
var path = require("path");
var destinationDB  = require("../models/destination.js");

var bodyParser = require('body-parser')
var morgan = require("morgan");

var publicPath = path.join(__dirname + "./../public/");
var indexPath = path.join(__dirname + "./../public/landing_page.html");
var jsPath = path.join(__dirname + "./../js/");
var nodeModulesPath = path.join(__dirname + "/../node_modules");

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(morgan("dev"));
app.use(express.static(publicPath));
app.use(express.static(nodeModulesPath));
app.use(express.static(jsPath));

app.get("/", function (request, response) {
  response.sendFile(indexPath);
});

app.get("/map_page", function (request, response) {
  response.sendFile(path.join(__dirname + "/../public/map_page.html"))
})

app.get("/locations", function (request, response) {
  destinationDB.find({}).exec()
  .then(function (location) {
    response.status(200).json(location);
  })
})

app.listen(1337, function () {
  console.log("I'm listening to you on port 1337, Jai");
})

// TODO:
// Flesh out modal
// Add search and address functionality
// Create places to visit and timer functionality