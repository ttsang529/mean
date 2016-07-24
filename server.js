var express = require('express');
var app = express();
var port = process.env.PORT || 3000;

// 在console印出收到的request
var morgan = require('morgan');

// demo
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
// 連接DB
require('./config/database.js');

//faker模組
var apiRoutes = require('./api/api');

// 引入body-parser 模組
var bodyParser = require('body-parser');


// 設定 express server
// log every request to the console
app.use(morgan('dev'));
//log file rotation
//Simple app that will log all requests in the Apache combined format to one log file per date in the log/ directory using the file-stream-rotator module.
var FileStreamRotator = require('file-stream-rotator');
var fs = require('fs');
var logDirectory = __dirname + '/log'
var accessLogStream = fs.createWriteStream( '/home/user/access.log', {flags: 'a'});
// setup the logger 
app.use(morgan('combined', {stream: accessLogStream}));
// ensure log directory exists 
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

// create a rotating write stream 
var accessLogStream = FileStreamRotator.getStream({
  date_format: 'YYYYMMDD',
  filename: logDirectory + '/access-%DATE%.log',
  frequency: 'daily',
  verbose: false
});
 
// setup the logger 
app.use(morgan('combined', {stream: accessLogStream}));

// 設定將req.body JSON化
app.use(bodyParser.json());
// 設定bodyParser支援HTML表單
app.use(bodyParser.urlencoded({
    extended: true
}));


// demo
app.use(cookieParser());
app.use(cookieSession({
    name: 'kuolun-session',
    keys: ['hello']
}));



// 設定路徑
require('./app/routes.js')(app);
//var reqes = require('./app/routes.js');
//app.use('/', reqes);
//設定subroute for faker
app.use('/api', apiRoutes);

//html on tatic file
app.use(express.static(__dirname + '/public'));



//launch==================================================
app.listen(port);
console.log('Server is running on port ' + port + '..........');