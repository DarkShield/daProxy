var httpProxy = require('http-proxy'),
createServer = require('./lib/proxyserver'),
mongoose = require('mongoose'),
Host = require('./lib/hostSchema'),
port = 8080;

if (process.env.NODE_ENV === 'development'){
  mongoose.connect('localhost', 'vicetest');
  if (process.env.PORT) {
    port = process.env.PORT;
  }
}
else if (process.env.NODE_ENV === 'production'){
  require('newrelic');
  mongoose.connect('10.136.20.210', 'vicetest');
  port = 80;
}
else {
  mongoose.connect('10.136.20.210', 'proxytest');
}

var allowed_hosts = {};

Host.find({}, function(err, hosts) {
  if(!err) {
    for (var i = 0; i < hosts.length; i++) {
      allowed_hosts[hosts[i].hostname] = hosts[i].status;
    }
    var proxy = httpProxy.createProxyServer();
    var server = createServer(proxy, allowed_hosts, port);
    server.startServer();
  }
});