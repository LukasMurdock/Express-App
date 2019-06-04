var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var fs = require('fs')



var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use(express.static('images'))


app.get('/video', function(getVideo) {
  function getVideo(request, response){
    var path = 'assets/first.mp4'
    var stat = fs.statSync(path)
    var fileSize = stat.size
    var range = req.headers.range
  
    if (range) {
      var parts = range.replace(/bytes=/, "").split("-")
      var start = parseInt(parts[0], 10)
      var end = parts[1]
        ? parseInt(parts[1], 10)
        : fileSize-1
  
      const chunksize = (end-start)+1
      const file = fs.createReadStream(path, {start, end})
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'video/mp4',
      }
  
      res.writeHead(206, head)
      file.pipe(res)
    } else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
      }
      res.writeHead(200, head)
      fs.createReadStream(path).pipe(res)
    }
  }})

module.exports = app;
