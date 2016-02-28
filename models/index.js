var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/library-dev');
mongoose.connection.on('error', console.error.bind(console, 'database connection error'));

var Destination = require('./destination.js');

module.exports = {
  Destination: Destination
};