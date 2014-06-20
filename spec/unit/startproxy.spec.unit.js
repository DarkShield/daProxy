/**
 * Created by mattjohansen on 6/17/14.
 */
var rewire = require("rewire");


describe('Unit, Start Proxy', function() {
  var startproxy, host = null;

  beforeEach(function(){
    startproxy = rewire('../../startproxy');

    mockHost = {find: jasmine.createSpy('find')};
    mockMongoose = {connect: jasmine.createSpy('connect')};
    startproxy.__set__('mongoose', mockMongoose);
    startproxy.__set__('Host',mockHost);
  });

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

  it('should connect to the proper db and port in development', function() {
    var env = 'development';
    var envPort = 9999;
    startproxy.__set__('env', env);
    startproxy.__set__('envPort', envPort);

    expect(mockMongoose.connect).not.toHaveBeenCalled();
    startproxy();
    expect(mockMongoose.connect).toHaveBeenCalledWith('localhost','vicetest');
    expect(startproxy.__get__('port')).toEqual(envPort);
  });

  it('should connect to the proper db and port (unspecified) in development', function() {
    var env = 'development';
    startproxy.__set__('env', env);

    expect(mockMongoose.connect).not.toHaveBeenCalled();
    startproxy();
    expect(mockMongoose.connect).toHaveBeenCalledWith('localhost','vicetest');
    expect(startproxy.__get__('port')).toEqual(8080);
  });

  it('should connect to the proper db and port in production', function() {
    var env = 'production';
    var envPort = 9999;
    startproxy.__set__('env', env);
    startproxy.__set__('envPort', envPort);

    expect(mockMongoose.connect).not.toHaveBeenCalled();
    startproxy();
    expect(mockMongoose.connect).toHaveBeenCalledWith('10.136.20.210','vicetest');
    expect(startproxy.__get__('port')).toEqual(80);
  });

  it('should connect to the proper db and port when no env exists', function() {

    expect(mockMongoose.connect).not.toHaveBeenCalled();
    startproxy();
    expect(mockMongoose.connect).toHaveBeenCalledWith('10.136.20.210', 'proxytest');
    expect(startproxy.__get__('port')).toEqual(8080);
  });

  it('should have a properly functioning checkBlocks method', function() {
    var checkBlocks = startproxy.__get__('checkBlocks');
    var mockfind = jasmine.createSpy('find');
    startproxy.__set__('Host', {find: mockfind});
    checkBlocks();

    expect(typeof(checkBlocks)).toBe('function');
    expect(mockfind).toHaveBeenCalled();
  });

  it('should have a properly functioning updateBlocks method', function() {
    var updateBlocks = startproxy.__get__('updateBlocks');
    expect(typeof(updateBlocks)).toBe('function');
  });

  it('should have a properly functioning initialize method', function() {
    var initialize = startproxy.__get__('initialize');
    var httpProxy = startproxy.__get__('httpProxy');
    var err = null;
    var hosts = [{hostname: 'wwwmattjaycom', status: 'enabled'}];
    spyOn(httpProxy, 'createProxyServer').andCallThrough();
    var startServer = jasmine.createSpy('startServer');
    var obj = {createServer: function() {
      return {
        on: jasmine.createSpy('test'),
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