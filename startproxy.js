var mitmproxy = require('./lib/proxyserver');
var mongoose = require('mongoose');
var Host = require('./lib/hostSchema');
var port = 8080;

if (process.env.NODE_ENV === 'development'){
  mongoose.connect('localhost', 'vicetest');
}
else if (process.env.NODE_ENV === 'test'){
  mongoose.connect('10.136.20.210', 'proxytest');
}

else{
  require('newrelic');
  mongoose.connect('10.136.20.210', 'vicetest');
  port = 80;
}


var allowed_hosts = {};

Host.find({}, function(err, hosts) {
  if(!err) {
    for (var i = 0; i < hosts.length; i++) {
      allowed_hosts[hosts[i].hostname] = hosts[i].status;
    }
    var proxy = mitmproxy({proxy_port: port, verbose: true, hosts: allowed_hosts});

    proxy.startServer();
  }
});


