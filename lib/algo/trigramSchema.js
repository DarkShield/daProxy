/**
 * Created by mattjohansen on 12/9/13.
 */

var mongoose = require('mongoose');

var trigramSchema = mongoose.Schema({
  str: String,
  attack: String
});

module.exports = mongoose.model('Trigram', trigramSchema);