var http = require('http'),
sys = require('sys'),
url = require('url'),
attack = require('./attack'),
parseCookies = require('./cookieparser'),
uuid = require('uuid');

module.exports = function createServer (proxy, allowed_hosts, port) {
  var server = http.createServer(function (request, response) {
    if (request.headers.host && allowed_hosts[request.headers.host.replace(/\./g, "")] === 'enabled') {
      //only way to get clientIP from behind load balancer
      request.remoteIP = (request.headers['x-forwarded-for']) ? request.headers['x-forwarded-for'] : request.connection.remoteAddress;

      var cookies = parseCookies(request);

      if (cookies.dstc == undefined) {
        request.dstc = uuid.v1();
        var outboundCookies = ["dstc="+request.dstc];
        //override setHeader so we can manipulate response
        var _setHeader = response.setHeader.bind(response);
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

      proxy.web(request, response, {target: 'http://' + request.headers.host + ':80' + url.parse(request.url).path});

      request.on('data', function(data){
        //buffering the request body
        request.body += data;
      });
      request.on('end', function(data){
        //attack check & write to db
        attack.check(request);
      });
    }
    else {
      //Should probably be changed to drop the connection.
      //We shouldn't respond for off domain
      sys.log('Aborting...' + request.url);
      response.writeHead(404, 'NOT FOUND',{ 'content-type': 'plain/text','connection': 'close'});
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