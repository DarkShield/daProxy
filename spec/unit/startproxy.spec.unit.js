/**
 * Created by mattjohansen on 6/17/14.
 */
var rewire = require("rewire");
var startproxy = rewire('../../startproxy');

describe('Unit, Start Proxy', function() {
  it('should have a correct default port global', function() {
    var port = startproxy.__get__('port');
    expect(port).toBe(8080);
  });

  it('should have an allowed_hosts global', function() {
    var allowed_hosts = startproxy.__get__('allowed_hosts');
    expect(allowed_hosts).toBeDefined();
    expect(typeof(allowed_hosts)).toBe('object');
  });

  it('should have an sweepList global', function() {
    var sweepList = startproxy.__get__('sweepList');
    expect(sweepList).toBeDefined();
    expect(sweepList.length).toEqual(0);
  });

  /*it('should connect to the proper db in development', function() {
    var env = 'development';
    var envPort = 8080;
    var init = startproxy.__get__('init');
    //startproxy.__set__('env', env);
    //startproxy.__set__('envPort', 8080);
    var mongoose = startproxy.__get__('mongoose');
    var obj = {mongoose: mongoose};
    var mockconnect = jasmine.createSpy('connect');
    spyOn(obj, 'mongoose').andReturn({connect: mockconnect});
    startproxy.__set__('mongoose', mongoose);
    init(env, envPort);

    expect(mockconnect).toHaveBeenCalledWith('localhost', 'vicetest');

  });*/

  it('should have a properly functioning initialize method', function() {
    var initialize = startproxy.__get__('initialize');
    var httpProxy = startproxy.__get__('httpProxy');
    var err = null;
    var hosts = [{hostname: 'wwwmattjaycom', status: 'enabled'}];
    spyOn(httpProxy, 'createProxyServer').andCallThrough();
    var startServer = jasmine.createSpy('startServer');
    var obj = {createServer: function() {
      return {
        on: function(){},
        startServer: startServer
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
    expect(startServer).toHaveBeenCalled();
  });



});