/**
 * Created by mattjohansen on 12/9/13.
 */
var mongoose = require('mongoose');
var Trigram = require('./trigramSchema');
var ngram = require('./ngram');

mongoose.connect('localhost', 'vicetest');


var reqDumpSchema = mongoose.Schema({
  requestedtimestamp: {type: Date, default: Date.now},
  method: String,
  headers: Object,
  url: String,
  body: String,
  remoteIP: String,
  remotePort: String,
  dstc: String,
  attack: String,
  attacks: Array
});

var RequestDump = mongoose.model('RequestDump', reqDumpSchema);

function trigramWriter(originalData) {
  var triData = ngram(originalData, 3);

  for (var i = 0; i <= triData.length; i++) {
    var tri = Trigram(triData[i]);
    tri.save(function(err) {
      if (err) console.log(err);
      console.log('saved');
    });
  }
}

function getReqData() {
  var yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 5);
  var yesterdayISO = yesterday.toISOString();

  var respond = function (err, docs) {
    trigramWriter(docs);
  };

  RequestDump.find({'requestedtimestamp': {$gte: yesterdayISO}, 'attack': 'true'}).limit(500).exec(respond);
}

getReqData();