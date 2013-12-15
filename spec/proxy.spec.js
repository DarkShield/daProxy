var mongoose = require('mongoose');
var Host = require('../lib/hostSchema');
var mitmproxy = require('../lib/proxyserver');

if (process.env.NODE_ENV === 'test'){
  mongoose.connect('10.192.198.253', 'proxytest');
}
else{
  mongoose.connect('localhost', 'vicetest');
}

