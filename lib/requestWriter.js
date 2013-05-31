var request = require('./requestSchema');
var mongoose = require('mongoose');

function requestWriter(reqObj){
    //console.log('log4 - requestWriter');
    var req = request(reqObj);
    req.save(function(err){
	//console.log('log5 - requestWriter.save');
        if (err) console.log('error');
        console.log('saved');
       // mongoose.disconnect();
  });
}
exports.requestWriter = requestWriter;

//add comment test
