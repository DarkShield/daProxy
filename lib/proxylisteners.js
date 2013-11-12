URL = require('url');
db = require('./requestWriter')
viceGrip = require('./waf/lib/viceGrip');
attack = require('./attack');

module.exports = function(proxy) {

  proxy.on('request', function(request, processor_object) {
        var body = '';
        request.on('data', function(data){
          body += data;
          request.body = body;
        });
        request.on('end', function(data){
          //attack check & write to db
          attack.check(request);
        });
  });

  proxy.on('response', function(response) {
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