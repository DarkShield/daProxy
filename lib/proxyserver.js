var http = require('http'),
  sys = require('sys'),
  url = require('url'),
  attack = require('./attack'),
  parseCookies = require('./cookieparser'),
  uuid = require('uuid'),
  Proxy = null,
  Allowed_hosts = null,
  requests = [];

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

var checkBlacklist = function (request) {
  var ip;
  var domain = request.headers.host.replace(/\./g, "");
  if (request.headers['x-forwarded-for']) {
    ip = request.headers['x-forwarded-for'];
  }
  else {
    ip = request.connection.remoteAddress;
  }

  for (var i = 0; i < Allowed_hosts[domain].blacklist.length; i++) {
    if(Allowed_hosts[domain].blacklist[i].ip === ip) {
      return true;
    }
  }
  return false;
};

var handleRequest = function (request, response) {
  request.startTime = new Date().getTime();
  requests.push(request);


  if (request.headers.host && Allowed_hosts[request.headers.host.replace(/\./g, "")] && Allowed_hosts[request.headers.host.replace(/\./g, "")].status === 'enabled' && !checkBlacklist(request)) {
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

  var server = http.createServer(handleRequest);
  this.server = server;

  this.startServer = function (){
    server.listen(port);
  };
  this.stopServer = function (){
    server.close();
  };
  this.updateBlacklist = function(domain, blacklist) {
    Allowed_hosts[domain].blacklist = blacklist
  };
  this.getRequests = function() {
    return requests
  };
  return this;
};