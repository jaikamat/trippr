var mongoose = require('mongoose');

var destinationSchema = new mongoose.Schema({
  placeName: String,
  coordinates: Array
});

module.exports = mongoose.model('Destination', destinationSchema);