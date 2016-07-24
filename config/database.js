//mongoose
var mongoose = require('mongoose');

//  fill in user/pwd
var dbURI = "mongodb://user:password@ds027215.mlab.com:27215/mean_db";

//connect mlab
mongoose.connect(dbURI);

//monitor connect
mongoose.connection.on('connected', function() {
    console.log('Mongoose connected to ' + dbURI);
});

//monitor connection error
mongoose.connection.on('error', function(err) {
    console.log('Mongoose connection error  ' + err);
});