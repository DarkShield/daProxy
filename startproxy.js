var httpProxy = require('http-proxy'),
  createServer = require('./lib/proxyserver'),
  mongoose = require('mongoose'),
  Host = require('./lib/hostSchema'),
  env = process.env.NODE_ENV,
  envPort = process.env.PORT,
  allowed_hosts = {},
  sweepList = [],
  requests = [],
  server = {},
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
    for(var i = 0; i < hosts.length; i++) {
      var blacklist = (hosts[i].blacklist) ? hosts[i].blacklist : []
      allowed_hosts[hosts[i].hostname]= {
        status: hosts[i].status,
        blacklist: blacklist
      };
      server.updateBlacklist(hosts[i].hostname, blacklist);
      for (var t = 0; t < blacklist.length; t++) {
        //push ips to sweeplist
        sweepList.push(blacklist[t].ip);
      }
    }
  }
  else {
    //may need to reconnect to db
  }
};

var checkBlocks = function() {
  Host.find({}, updateBlocks);
};

var kill = function (req) {
  if (sweepList.indexOf(req.socket.remoteAddress) > -1) {
    req.socket.end();
    requests.splice(requests.indexOf(req),1);
  }
};

var sweep = function() {
  requests = server.getRequests();
  if (sweepList.length > 0 && requests.length > 0) {
    requests.forEach(kill);
  } return sweepList = []
};


var initialize = function(err, hosts) {
  if(!err) {
    for (var i = 0; i < hosts.length; i++) {
      allowed_hosts[hosts[i].hostname]= {
        status: hosts[i].status,
        blacklist: (hosts[i].blacklist) ? hosts[i].blacklist : []
      };
    }

    var proxy = httpProxy.createProxyServer();
    server = createServer(proxy, allowed_hosts, port);

    /*WebSocket Support
    server.on('upgrade', function (req, socket, head) {
      proxy.ws(req, socket, head);
    });*/

    server.startServer();

    //This connects to the db and checks for new blocks
    setInterval(checkBlocks, 1000);

    //Sweep newly blacklisted servers right away
    setInterval(sweep ,1000);

  }
};

Host.find({}, initialize);