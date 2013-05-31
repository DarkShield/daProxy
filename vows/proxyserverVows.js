var server,
    mitmproxy = require('./../lib/proxyserver'),
    vows = require('vows'),
    assert = require('assert'),
    request = require('request'),
    port = 8080,
    verbos = true;
var mongoose = require('mongoose');
mongoose.connect('10.192.198.253', 'vicetest');


vows.describe('Proxy').addBatch({
    'when proxyserver is required':{
        topic: function(){return mitmproxy},
        'we get a function': function(topic){
            assert.isFunction(topic);
        }
    },
    'after calling the function':{
        topic: function(){return mitmproxy({proxy_port: port, verbose: verbos})},
        'we get an object': function(proxies){
            assert.isObject(proxies);
        },
        'that has a startServer method': function(proxies){
            assert.isFunction(proxies.startServer);
        },
        'that has a stopServer method': function(proxies){
            assert.isFunction(proxies.stopServer);
        },
        'its port value matches the specified port': function(proxies){
            assert.equal(port, proxies.options.proxy_port);
        },
        'its verbose flag equals that specified': function(proxies){
            assert.equal(verbos, proxies.options.verbose); //
        },
        'when the servers are running we can request:':{
            topic: function(proxies){
                proxies.startServer();
                server = proxies;
                return proxies;
            },
            'urbanhydro.org': respondsWith(200),
            'www.urbanhydro.org/?test=<script>': respondsWith(301),
            'www.yourbrainproject.com': respondsWith(200),
	    //'supercroppers.com/testing/directory/../test': respondsWith(301),
            'supercroppers.com/wizbangs.php': respondsWith(301),
            'www.supercroppers.com':respondsWith(200),
            //'urbanhydro.org/?test=<script>': respondsWith(404)
        }
    }
}).export(module);
 //TODO write database checks.
function respondsWith(code){
    var context = {
            topic: function(){
                var url = this.context.name;
                request({
                    method: 'GET',
                    uri: 'http://'+ url,
                    proxy: 'http://localhost:8080',
                    followRedirect: false
                }, this.callback);
            }
    };
    context['we get a ' + code + ' response code'] = assertStatus(code);
    return context;
}

function assertStatus(code) {
    return function (e, res) {
        assert.equal (res.statusCode, code);
    };
}
