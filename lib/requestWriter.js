var request = require('./requestSchema');
var mongoose = require('mongoose');

function requestWriter(reqObj){
  var req = request(reqObj);
  req.save(function(err){
    if (err) console.log('error');
    console.log('saved');
  });
}

exports.requestWriter = requestWriter;