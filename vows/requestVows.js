var vows = require('vows'),
    assert = require('assert'),
    request = require('./../lib/requestSchema');

var reqObj= {
    method: "GET",
    headers: {},
    url: "http://test.com",
    body: '',
    remoteIP: '127.0.0.1',
    remotePort: '8080'
};


vows.describe('requestSchema').addBatch({
'when requestSchema is Required as request':{
    topic: '',
    'we get a function': function(){
        assert.isFunction(request);
    },
    'that has a disconnect method': function(){
        assert.isFunction(request.disconnect);
    }
},
'when we call the request function without an argument ':{
    topic: function(){
        return request();
    },
    'we get a request schema object': function(topic){
        assert.isObject(topic);
        console.log(topic);
    },
    'the request schema object has an _id:string property': function(topic){
        assert.isString(topic.id);
    },
    'the request schema object has a requestedtimestamp:object': function(topic){
        //for some reason .isObject not reporting properly here
        assert.equal(typeof(topic.requestedtimestamp), 'object');
    }
},
'when we call the request function with a valid request object':{
    topic: function(){
        return request(reqObj);
    },
    'we get a request schema object': function(topic){
        assert.isObject(topic);
        console.log(topic);
    },
    'the request schema objects properties are defined according to the request object provided': function(topic){
        assert.equal(topic.method, reqObj.method);
        assert.equal(topic.headers, reqObj.headers);
        assert.equal(topic.url, reqObj.url);
        assert.equal(topic.body, reqObj.body);
        assert.equal(topic.remoteIP, reqObj.remoteIP);
        assert.equal(topic.remotePort, reqObj.remotePort);
    },
    'the request schema object has an _id:string property': function(topic){
        assert.isString(topic.id);
    },
    'the request schema object has a requestedtimestamp:object property': function(topic){
        assert.equal(typeof (topic.requestedtimestamp), 'object');
    }
},
'when calling the request function with a malformed request object (unexpected property)':{
    topic: function(){
        reqObj.forged = 'bad';
        return request(reqObj);
    },
    'we get a request schema object': function(topic){
        assert.isObject(topic);
    },
    'the request schema object does not have the forged property': function(topic){
        assert.isUndefined(topic.forged);
    },
    'the request schema object does contain the correctly formed properties': function(topic){
        assert.equal(topic.method, reqObj.method);
        assert.equal(topic.headers, reqObj.headers);
        assert.equal(topic.url, reqObj.url);
        assert.equal(topic.body, reqObj.body);
        assert.equal(topic.remoteIP, reqObj.remoteIP);
        assert.equal(topic.remotePort, reqObj.remotePort);
    }
}}).export(module);