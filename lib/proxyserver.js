var http = require('http'),
sys = require('sys'),
url = require('url'),
attack = require('./attack'),
parseCookies = require('./cookieparser'),
uuid = require('uuid'),
Proxy,
Allowed_hosts;

var appendData = function(data){
  //buffering the request body
  this.body += data;
};

var attackCheckOnEnd = function(data){
  //attack check & write to db
  attack.check(this);
};

var overrideHeaders = function (response, outboundCookies){
  var _setHeader = response.setHeader.bind(response);
  response.setHeader = function(name, value) {
    if(name && name.toLowerCase() === 'set-cookie'){
      outboundCookies.push(value);
    }
    _setHeader(name, value);
    _setHeader('set-cookie', outboundCookies);
  }
};


var handleRequest = function (request, response) {
  if (request.headers.host && Allowed_hosts[request.headers.host.replace(/\./g, "")] === 'enabled') {
    //only way to get clientIP from behind load balancer
    request.remoteIP = (request.headers['x-forwarded-for']) ? request.headers['x-forwarded-for'] : request.connection.remoteAddress;

    var cookies = parseCookies(request);

    if (cookies.dstc == undefined) {
      request.dstc = uuid.v1();
      var outboundCookies = ["dstc="+request.dstc];
      //override setHeader so we can manipulate response
      overrideHeaders(response, outboundCookies);
    }
    else {
      request.dstc = cookies.dstc;
    }

    Proxy.web(request, response, {target: 'http://' + request.headers.host + ':80' + url.parse(request.url).path});

    request.on('data', appendData);
    request.on('end', attackCheckOnEnd);
  }
  else {
    //Should probably be changed to drop the connection.
    //We shouldn't respond for off domain
    sys.log('Aborting...' + request.url);
    response.writeHead(404, 'NOT FOUND',{ 'content-type': 'plain/text','connection': 'close'});
    response.end();
  }
};

module.exports = function createServer (proxy, allowed_hosts, port) {
  Proxy = proxy;
  Allowed_hosts = allowed_hosts;
  var server = http.createServer(handleRequest);

  this.startServer = function (){
    server.listen(port);
  };
  this.stopServer = function (){
    server.close();
  };
  return this;
};