var http = require('http'),
sys = require('sys'),
url = require('url'),
attack = require('./attack'),
static = require('node-static');
parseCookies = require('./cookieparser');

module.exports = function createServer (proxy, allowed_hosts, port) {

  var server = http.createServer(function (request, response) {
    if (request.headers.host && allowed_hosts[request.headers.host.replace(/\./g, "")] === 'enabled') {
      var requrl = url.parse(request.url);
      if (request.headers['x-forwarded-for']) {
        request.remoteIP = request.headers['x-forwarded-for'];
      }
      else{
        request.remoteIP = request.connection.remoteAddress;
      }
      var cookies = parseCookies(request);
      if (cookies.dstc == undefined) {
        var dstc = Math.random().toString();
        dstc = dstc.substring(2,dstc.length);
        request.dstc = dstc;
        var _setHeader = response.setHeader.bind(response);
        var outboundCookies = ["dstc="+request.dstc];
        response.setHeader = function(name, value) {
          if(name && name.toLowerCase() === 'set-cookie'){
            outboundCookies.push(value);
          }
          _setHeader(name, value);
          _setHeader('set-cookie', outboundCookies);
        }
      }
      else {
        request.dstc = cookies.dstc;
      }
      proxy.web(request, response, {target: 'http://' + request.headers.host + ':80' + requrl.path});
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