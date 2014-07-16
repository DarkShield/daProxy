var request = require('./requestSchema');
var sys = require('sys');

var logSave = function(err){
  if (err) sys.log('error');
  else sys.log('saved');
};

function requestWriter(reqObj){
  var req = request(reqObj);
  req.save(logSave);
}

exports.requestWriter = requestWriter;