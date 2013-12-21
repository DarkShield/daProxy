// new proxy

var mitmproxy = require('./vice-mitm-proxy/proxy'),
    processor = require('./proxylisteners');

// Proxy^
module.exports = function (options){
    return mitmproxy(options, processor);
};