// proxy vows

var vows = require('vows'),
	assert = require('assert'),
	proxy = require('./proxy');

vows.describe('Proxy').addBatch({
	'When requiring vice-mitm-proxy':{
		topic: function(){return proxy},
		'we are passed a function': function(topic){
			assert.isFunction(topic);
		}
    },
	'when calling the proxy function':{
        topic: function(){
            return proxy({proxy_port: 8080, verbose: true});
        },
        'we get an object': function(topic){
            assert.isObject(topic);
        },
        'that has a startServer function': function(topic){
            assert.isFunction(topic.startServer);
        },
        'that has a stopServer function': function(topic){
            assert.isFunction(topic.stopServer);
        }
    }
}).run();