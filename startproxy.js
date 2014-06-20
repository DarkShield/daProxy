var httpProxy = require('http-proxy'),
  createServer = require('./lib/proxyserver'),
  mongoose = require('mongoose'),
  Host = require('./lib/hostSchema'),
  env = process.env.NODE_ENV,
  envPort = process.env.PORT,
  allowed_hosts = {},
  sweepList = [],
  port = 8080;

if (env === 'development'){
  mongoose.connect('localhost', 'vicetest');
  if (envPort) {
    port = envPort;
  }
}
else if (env === 'production'){
  require('newrelic');
  mongoose.connect('10.136.20.210', 'vicetest');
  port = 80;
}
else {
  mongoose.connect('10.136.20.210', 'proxytest');
}

var checkBlocks = function() {

};

var updateBlocks = function(err, hosts) {

};

var initialize = function(err, hosts) {
  if(!err) {
    for (var i = 0; i < hosts.length; i++) {
      allowed_hosts[hosts[i].hostname] = hosts[i].status;
    }

    var proxy = httpProxy.createProxyServer();
    var server = createServer(proxy, allowed_hosts, port);

    /*WebSocket Support
    server.on('upgrade', function (req, socket, head) {
      proxy.ws(req, socket, head);
    });*/

    server.startServer();
  }
};

Host.find({}, initialize);