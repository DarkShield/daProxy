var mitmproxy = require('./proxyserver');
var mongoose = require('mongoose');
var Host = require('./hostSchema')
mongoose.connect('10.192.198.253', 'vicetest');


//var allowed_hosts = {};
Host.find({}, function(err, hosts) {
  if(!err) console.log(hosts);
});
//console.log(allowed_hosts);

var proxy = mitmproxy({proxy_port: 80, verbose: true});

proxy.startServer();
