// new proxy

var mitmproxy = require('./../node_modules/vice-mitm-proxy/proxy'),
    processor = require('./proxylisteners');

// Proxy^
module.exports = function (options){
    return mitmproxy(options, processor);
};