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
    var env = '';
    startproxy.__set__('env', env);
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

  describe('updateBlocks', function() {
    var init_allowed_hosts, updateBlocks, server = null;

    beforeEach(function() {
      updateBlocks = startproxy.__get__('updateBlocks');
      init_allowed_hosts = {'wwwmattjaycom': {status: 'enabled', blacklist: [{ip: '1.2.3.4', time: 1000}]}}
      startproxy.__set__('allowed_hosts', init_allowed_hosts);
      server = {updateBlacklist: jasmine.createSpy('updateBlacklist')}
      startproxy.__set__('server', server);
    });

    afterEach(function() {
      server = null;
    });

    it('should have a properly functioning updateBlocks method when there is no db query error', function() {
      expect(typeof(updateBlocks)).toBe('function');

      var err = null;
      var hosts = [{
        hostname: 'wwwmattjaycom',
        status: 'enabled',
        blacklist: [{ip: '1.2.3.4', time: 1000}, {ip: '9.8.7.6', time : 1000}]
      }];
      var sweepList = startproxy.__get__('sweepList');
      expect(sweepList.length).toBe(0);
      updateBlocks(err, hosts);
      sweepList = startproxy.__get__('sweepList')
      expect(server.updateBlacklist).toHaveBeenCalledWith(hosts[0].hostname, hosts[0].blacklist);
      expect(sweepList.length).toBe(2);
    });
  });

  it('should have a properly functioning kill method', function() {
    var kill = null;
    kill = startproxy.__get__('kill');
    expect(typeof(kill)).toBe('function');

    var requests = {
      splice: jasmine.createSpy('splice'),
      indexOf: jasmine.createSpy('indexOf')
    }
    startproxy.__set__('requests', requests);
    var sweepList = ['1.2.3.4'];
    startproxy.__set__('sweepList', sweepList);
    var req = {
      socket: {
        remoteAddress: '1.2.3.4',
        end: jasmine.createSpy('end')
      }
    };
    kill(req);

    expect(req.socket.end).toHaveBeenCalled();
    expect(requests.splice).toHaveBeenCalled();
    expect(requests.indexOf).toHaveBeenCalled();
  });

  describe('sweep', function() {
    var server, sweep = null;

    beforeEach(function() {
      sweep = startproxy.__get__('sweep');
      server = {getRequests: function(){}};
      startproxy.__set__('server', server);
    });

    it('should have a properly functioning sweep method when there are requests', function() {
      expect(typeof(sweep)).toBe('function');
      var sweepList = ['1.2.3.4'];
      startproxy.__set__('sweepList', sweepList);
      var requests = [{test: 'something'}];
      spyOn(requests, 'forEach');
      spyOn(server, 'getRequests').andReturn(requests);
      sweep();
      sweepList = startproxy.__get__('sweepList');
      expect(server.getRequests).toHaveBeenCalled();
      expect(requests.forEach).toHaveBeenCalled();
      expect(sweepList.length).toBe(0);
    });

    it('should have a properly functioning sweep method when there are no requests', function() {
      expect(typeof(sweep)).toBe('function');
      var sweepList = ['1.2.3.4'];
      startproxy.__set__('sweepList', sweepList);
      var requests = [];
      spyOn(requests, 'forEach');
      spyOn(server, 'getRequests').andReturn(requests);
      sweep();
      sweepList = startproxy.__get__('sweepList');
      expect(server.getRequests).toHaveBeenCalled();
      expect(requests.forEach).not.toHaveBeenCalled();
      expect(sweepList.length).toBe(0);
    });

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
    expect(obj.createServer.mostRecentCall.args[1]).toEqual({ wwwmattjaycom : { status : 'enabled', blacklist:[] } } );
    expect(obj.createServer.mostRecentCall.args[2]).toEqual(8080);
    expect(startServer).toHaveBeenCalled();

    //TODO: add tests for set Intervals with jasmine's tick feature
  });
});