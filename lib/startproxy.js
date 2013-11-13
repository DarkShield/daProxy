//require('newrelic');
var mitmproxy = require('./proxyserver');
var mongoose = require('mongoose');
var Host = require('./hostSchema')
mongoose.connect('localhost', 'vicetest');

var allowed_hosts = {};

Host.find({}, function(err, hosts) {
  if(!err) {
    for (var i = 0; i < hosts.length; i++) {
      allowed_hosts[hosts[i].hostname] = hosts[i].status;
    }
    var proxy = mitmproxy({proxy_port: 8080, verbose: true, hosts: allowed_hosts});
    console.log(hosts);
    proxy.startServer();
  }
});


