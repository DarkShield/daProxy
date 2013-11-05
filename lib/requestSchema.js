var mongoose = require('mongoose');

var reqSchema = mongoose.Schema({
  requestedtimestamp: {type: Date, default: Date.now},
  method: String,
  headers: Object,
  url: String,
  body: String,
  remoteIP: String,
  remotePort: String,
  attack: String,
  attacks: {
    match: {
      type: String,
      ids: Array,
      matches: Array,
      score: Number
    }
  }
});

module.exports = mongoose.model('Request', reqSchema);
