'use strict';

var express = require('express');
var bodyParser = require('body-parser');

var cors = require('cors');
var myApp = require('./myApp');



var app = express();


var port = process.env.PORT || 3000;


app.use(cors());

app.use(bodyParser.urlencoded({extended:false}));

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

  
// your first API endpoint... 
app.route("/api/shorturl/new")
  .post( myApp.generateShortUrl )

app.route("/api/shorturl/:short_url")
  .get(myApp.getShortUrl )

app.listen(port, function () {
  console.log('Node.js listening ... ',port);
});