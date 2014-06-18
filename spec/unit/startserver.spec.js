/**
 * Created by mattjohansen on 6/17/14.
 */
var rewire = require("rewire");
var startproxy = rewire('../../startproxy');

describe('Unit, Start Proxy', function() {
  it('should have a correct default port property', function() {
    var port = startproxy.__get__('port');
    expect(port).toBe(8080);
  });

  it('should have a properly functioning initialize method', function() {
    var initialize = startproxy.__get__('initialize');
    var httpProxy = startproxy.__get__('httpProxy');
    var err = null;
    var hosts = [{hostname: 'wwwmattjaycom', status: 'enabled'}];
    spyOn(httpProxy, 'createProxyServer').andCallThrough();
    var obj = {createServer: function() {
      return {
        on: function(){},
        startServer: function(){}
      };
    }};
    spyOn(obj, 'createServer').andCallThrough();
    startproxy.__set__('createServer', obj.createServer);

    expect(initialize).toBeDefined();
    expect(typeof(initialize)).toBe('function');
    initialize(err, hosts);
    expect(httpProxy.createProxyServer).toHaveBeenCalled();
    expect(obj.createServer).toHaveBeenCalled();
    expect(obj.createServer.mostRecentCall.args[1]).toEqual({'wwwmattjaycom': 'enabled'});
    expect(obj.createServer.mostRecentCall.args[2]).toEqual(8080);

  });

});