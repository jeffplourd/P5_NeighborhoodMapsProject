var bodyParser = require('body-parser');
var express = require('express');
var app = express();

app.use(bodyParser.json({limit:'100kb'}));

app.use('/',express.static('app'));

var server = app.listen(3000,function(){
  console.log('Example app listening at 3000');
});
