/**
 * Created by mattjohansen on 11/5/13.
 */
var mongoose = require('mongoose');

var hostSchema = mongoose.Schema({
  hostname: String,
  status: String//,
  //blacklist: [{ip: timetoblock}]
});

module.exports = mongoose.model('Host', hostSchema);