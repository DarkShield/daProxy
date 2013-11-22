attack = require('./attack');

function parseCookies (request) {
  var list = {},
    rc = request.headers.cookie;

  rc && rc.split(';').forEach(function( cookie ) {
    var parts = cookie.split('=');
    list[parts.shift().trim()] = decodeURIComponent(parts.join('='));
  });

  return list;
}

module.exports = function(proxy) {

  proxy.on('request', function(request) {
    var body = '';
    request.remoteIP = request.connection.remoteAddress;
    request.remotePort = request.connection.remotePort;
    request.on('data', function(data){
      body += data;
      request.body = body;
    });
    request.on('end', function(data){
    //attack check & write to db
      attack.check(request);
    });
  });

  proxy.on('response', function(proxy_response, reqres) {
    /**
     * If the dstc cookie doesn't exist, set it.
     */
    var cookies = parseCookies(reqres.req);
    if (cookies.dstc == undefined) {
      reqres.res.setHeader("Set-Cookie", ["dstc="+reqres.req.dstc]);
    }
    //else console.log('cookie exists');
      //console.log("[" + url.hostname + url.pathname + "] - Processor response event, response server header: " + response.headers.server);
  });

  proxy.on('response_data', function(data) {
      //console.log("[" + url.hostname + url.pathname + "] - Processor response data event, length: " + data.length);
  });

  proxy.on('response_end', function() {
      //console.log("[" + url.hostname + url.pathname + "] - Processor response end event");
      //test
  });
};