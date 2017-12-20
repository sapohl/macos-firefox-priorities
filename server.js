// server.js
// where your node app starts

// init project
var express = require("express");
var cors = require('cors');
var app = express();
var bodyParser = require("body-parser");
var fs = require("fs");

var bugStoreFile = "bugStore.txt";

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

app.use(express.static('public')); // http://expressjs.com/en/starter/static-files.html
app.use(bodyParser.json());        // for parsing application/json

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function(req, resp) {
  resp.sendFile(__dirname + '/views/index.html');
});

app.get("/loadBugs", function(req, resp) {
  fs.readFile(bugStoreFile, "utf8", function(err, data) {
    resp.send(data);
  });
});

app.post("/saveBugs", function(req, resp) {
  //console.log(req);
  var bugStore = req.body;
  fs.writeFile(bugStoreFile, JSON.stringify(bugStore), function(err) {
    if (err) {
      console.log(err);
      resp.sendStatus(500);
      return;
    }
    resp.sendStatus(200);
  });
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function() {
  console.log("App is listening on port: " + listener.address().port);
});
