URL = require('url');
db = require('./requestWriter')
viceGrip = require('./waf/lib/viceGrip');
attack = require('./attack');

module.exports = function(proxy) {
    var url;

    proxy.on('request', function(request, req_url) {
        //console.log('log1 - request');
	url = req_url;
        (function(request) {
            var body = '';
            var reqObj = {
                method: request.method,
                headers: request.headers,
                url: request.url,
                body: '',
                remoteIP: request.connection.remoteAddress,
                remotePort: request.connection.remotePort
            };
            request.on('data', function(data){
                body += data;
                reqObj.body = body;
            });
            request.on('end', function(data){
		//console.log('log2 - end');
               //attack check & write to db
               attack.check(reqObj);
                //requestWriter save to mongo
                //db.requestWriter(reqObj);
            });  //
        })(request);
        //TODO Instantiate WAF checks here
            //var vulns = ['csrf'];
            //viceGrip.waf(request, vulns);
        //console.log("[" + url.hostname + url.pathname + "] - Processor request event, url: " + URL.format(req_url));
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

