URL = require('url');
db = require('./requestWriter')
viceGrip = require('./waf/lib/viceGrip');
attack = require('./attack');

module.exports = function(proxy) {
    var url;

    proxy.on('request', function(request, req_url) {
	url = req_url;
        if (request.headers.host == 'www.mattjay.com' || request.headers.host == 'mattjay.com') {
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
               //attack check & write to db
               attack.check(reqObj);
            });
        })(request);
	} else {
	console.log('Off Domain');
	}
        //TODO Instantiate WAF checks here
            //var vulns = ['csrf'];
            //viceGrip.waf(request, vulns);
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

