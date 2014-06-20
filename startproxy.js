var httpProxy = require('http-proxy'),
  createServer = require('./lib/proxyserver'),
  mongoose = require('mongoose'),
  Host = require('./lib/hostSchema'),
  env = process.env.NODE_ENV,
  envPort = process.env.PORT,
  allowed_hosts = {},
  sweepList = [],
  port = 8080;

module.exports = function dbConnect() {
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
};

var updateBlocks = function(err, hosts) {
  if(!err) {
    //compare allowed_hosts to new values
    //if different push new blocks addBlackListIP(domain, ip, time)
    //push to sweeplist
  }
  else {
    //may need to reconnect to db
  }
};

var checkBlocks = function() {
  Host.find({}, updateBlocks);
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

    //This connects to the db and checks for new blocks
    setInterval(checkBlocks, 1000);
  }
};

Host.find({}, initialize);