'use strict'
// server.js
// where your node app starts

// init project
var helmet = require("helmet");
var express = require('express');
var multer = require('multer');
var app = express();
app.use(helmet())

var storage = multer.memoryStorage();
var upload = multer({storage: storage, limits: {fileSize: 2e+7}})

app.get("/", function(request, response, next){
    response.sendFile(process.cwd()+"/views/index.html");
})

app.post("/file-size", upload.single('upload'), function(request, response, next){
  response.json({size: request.file.size});
})

app.use(function(err, req, res, next){
  if(err.message === "File too large"){
    res.send("The file you are trying to check is too big. Try again with something smaller.");
  }else{
    next(err);
  }
})

app.use(function (err, req, res, next) {
  if (res.headersSent) {
    return next(err)
  }
  res.status(500)
  res.render('error', { error: err })
})

var listener = app.listen(process.env.PORT, function () {
    console.log('Your app is listening on port ' + listener.address().port);
});
