var http = require('http'),
sys = require('sys'),
url = require('url'),
attack = require('./attack');

module.exports = function createServer (proxy, allowed_hosts, port) {
  var server = http.createServer(function (request, response) {
    if (request.headers.host && allowed_hosts[request.headers.host.replace(/\./g, "")] === 'enabled') {
      requrl = url.parse(request.url);
      request.remoteIP = request.connection.remoteAddress;
      proxy.web(request, response, {target: 'http://' + request.headers.host + ':80' + requrl.path});
      proxy.on('error', function(e) {
        sys.log(e);
      });
      request.on('data', function(data){
        request.body += data;
      });
      request.on('end', function(data){
        //attack check & write to db
        attack.check(request);
      });
    }else {
      sys.log('Aborting...' + request.url);
      response.writeHead(404, 'NOT FOUND',{ 'content-type': 'text/html','connection': 'close'});
      response.end();
    }
  });
  this.startServer = function (){
    server.listen(port);
  };
  this.stopServer = function (){
    server.close();
  };
  return this;
};