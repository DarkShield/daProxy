require('newrelic');
var mitmproxy = require('./proxyserver');
var mongoose = require('mongoose');
var Host = require('./hostSchema');
mongoose.connect('10.136.20.210', 'vicetest');

var allowed_hosts = {};

Host.find({}, function(err, hosts) {
  if(!err) {
    for (var i = 0; i < hosts.length; i++) {
      allowed_hosts[hosts[i].hostname] = hosts[i].status;
    }
    var proxy = mitmproxy({proxy_port: 80, verbose: true, hosts: allowed_hosts});

    proxy.startServer();
  }
});


