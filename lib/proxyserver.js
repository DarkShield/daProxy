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

var attackCheckOnEnd = function(){
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

var setDstcCookie = function (response, cookies){
  var dstc;
  if (cookies.dstc == undefined) {
    dstc = uuid.v1();
    overrideHeaders(response, ["dstc="+dstc]);
  }
  else {
    dstc = cookies.dstc;
  }
  return dstc
};

var setRemoteIP = function (request){
  return (request.headers['x-forwarded-for']) ? request.headers['x-forwarded-for'] : request.connection.remoteAddress
};


var handleRequest = function (request, response) {
  if (request.headers.host && Allowed_hosts[request.headers.host.replace(/\./g, "")] === 'enabled') {
    //only way to get clientIP from behind load balancer
    request.remoteIP = setRemoteIP(request);
    request.dstc = setDstcCookie(response, parseCookies(request));
    request.on('data', appendData);
    request.on('end', attackCheckOnEnd);

    Proxy.web(request, response, {target: 'http://' + request.headers.host + ':80' + url.parse(request.url).path});
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
  var requests = [];

  var server = http.createServer(handleRequest);
  this.server = server;

  this.startServer = function (){
    server.listen(port);
  };
  this.stopServer = function (){
    server.close();
  };
  this.addBlackListIP = function(domain, ip, time) {
    Allowed_hosts[domain].blacklist.push({ip: time});
  };
  this.getRequests = function() {
    return requests
  };
  return this;
};