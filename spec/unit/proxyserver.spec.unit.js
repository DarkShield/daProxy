/**
 * Created by mattjohansen on 6/16/14.
 */
var rewire = require("rewire");
var proxy = rewire('../../lib/proxyserver');
var events = require('events');


describe('Unit, Proxyserver', function() {

  it('should have a functioning appendData method', function() {
    var eventEmitter = new events.EventEmitter();
    var appendData = proxy.__get__('appendData');
    eventEmitter.on('append', appendData);
    var data = "456";
    eventEmitter['body'] = '123';

    expect(eventEmitter['body']).toBe("123");
    eventEmitter.emit('append', data);
    expect(eventEmitter['body']).toBe("123456");

  });

  it('should have a functioning attackCheckOnEnd method', function() {
    var event = new events.EventEmitter();
    var attackCheckOnEnd = proxy.__get__('attackCheckOnEnd');
    event.on('attack', attackCheckOnEnd);
    var attack = proxy.__get__('attack');
    spyOn(attack, 'check');
    event.emit('attack', attackCheckOnEnd);

    expect(attack.check).toHaveBeenCalled();
    expect(attack.check).toHaveBeenCalledWith(event);
  });

  it('should have a functioning overrideHeaders method', function() {
    var overrideHeaders = proxy.__get__('overrideHeaders');
    var response = {
      setHeader: {bind: function(){}}
    };
    var outBoundCookies = ['dstc=1234'];

    expect(typeof(response.setHeader)).toBe('object');
    overrideHeaders(response, outBoundCookies);
    expect(typeof(response.setHeader)).toBe('function');

  });

  it('should have a functioning setDstcCookie method with no dstc cookie', function() {
    var setDstcCookie = proxy.__get__('setDstcCookie');
    var overrideHeaders = jasmine.createSpy('overrideHeaders')
    proxy.__set__('overrideHeaders', overrideHeaders);
    var response = {setHeader: function(){}};
    var cookies = {};
    var dstc = setDstcCookie(response, cookies);
    expect(overrideHeaders).toHaveBeenCalled();
    expect(overrideHeaders).toHaveBeenCalledWith(response, ["dstc="+dstc]);
    expect(dstc).toBeDefined();
  });

  it('should have a functioning setDstcCookie method with a dstc cookie', function() {
    var setDstcCookie = proxy.__get__('setDstcCookie');
    var overrideHeaders = jasmine.createSpy('overrideHeaders')
    proxy.__set__('overrideHeaders', overrideHeaders);
    var response = {setHeader: function(){}};
    var cookies = {dstc: 1234};
    var dstc = setDstcCookie(response, cookies);
    expect(overrideHeaders).not.toHaveBeenCalled();
    expect(dstc).toBeDefined();
    expect(dstc).toBe(1234);
  });

  it('should have a functioning setRemoteIP method when forwarded', function() {
    var setRemoteIP = proxy.__get__('setRemoteIP');
    var request = {
      headers: {'x-forwarded-for': '1.2.3.4'},
      connection: {remoteAddress: '9.8.7.6'}
    };
    var remoteIP = setRemoteIP(request);

    expect(remoteIP).toBeDefined();
    expect(remoteIP).toBe('1.2.3.4');
  });

  it('should have a functioning setRemoteIP method when not forwarded', function() {
    var setRemoteIP = proxy.__get__('setRemoteIP');
    var request = {
      headers: {},
      connection: {remoteAddress: '9.8.7.6'}
    };
    var remoteIP = setRemoteIP(request);

    expect(remoteIP).toBeDefined();
    expect(remoteIP).toBe('9.8.7.6');
  });

  it('should have a functioning handleRequest method when host is allowed', function() {
    var request = {
      headers: {host: 'www.mattjay.com'},
      url: '/',
      on: function(){}
    };
    var response = {
      writeHead: function(){},
      end: function(){}
    };
    var handleRequest = proxy.__get__('handleRequest');
    var setRemoteIP = jasmine.createSpy('setRemoteIP');
    proxy.__set__('setRemoteIP', setRemoteIP);
    var setDstcCookie = jasmine.createSpy('setDstcCookie');
    proxy.__set__('setDstcCookie', setDstcCookie);
    var appendData = jasmine.createSpy('appendData');
    var parseCookies = proxy.__get__('parseCookies');
    proxy.__set__('appendData', appendData);
    var attackCheckOnEnd = jasmine.createSpy('attackCheckOnEnd');
    proxy.__set__('attackCheckOnEnd', attackCheckOnEnd);
    proxy.__set__('Allowed_hosts', {wwwmattjaycom: 'enabled'});
    proxy.__set__('Proxy', {web: function(){}});
    var Proxy = proxy.__get__('Proxy');
    spyOn(Proxy, 'web');
    spyOn(request, 'on');

    handleRequest(request, response);
    expect(setRemoteIP).toHaveBeenCalled();
    expect(setRemoteIP).toHaveBeenCalledWith(request);
    expect(setDstcCookie).toHaveBeenCalled();
    expect(setDstcCookie).toHaveBeenCalledWith(response, parseCookies(request));
    expect(request.on).toHaveBeenCalled();
    expect(request.on).toHaveBeenCalledWith('data', appendData);
    expect(request.on).toHaveBeenCalledWith('end', attackCheckOnEnd);
    expect(Proxy.web).toHaveBeenCalled();
    expect(Proxy.web).toHaveBeenCalledWith(request, response, {target: 'http://www.mattjay.com:80/'});
  });

  it('should have a functioning handleRequest method when host is not allowed', function() {
    var request = {
      headers: {host: 'www.google.com'},
      url: 'www.google.com/',
      on: function(){}
    };
    var response = {
      writeHead: function(){},
      end: function(){}
    };
    var handleRequest = proxy.__get__('handleRequest');
    proxy.__set__('Allowed_hosts', {'wwwmattjaycom': 'enabled'});
    spyOn(response, 'writeHead');
    spyOn(response, 'end');

    handleRequest(request, response);
    expect(response.writeHead).toHaveBeenCalled();
    expect(response.end).toHaveBeenCalled();
  });

  describe('Create Server', function(){
    var http,
        handleRequest,
        allowed_hosts,
        Allowed_hosts,
        port,
        Port,
        _proxy,
        Proxy;

    beforeEach(function(){
      http = proxy.__get__('http');
      handleRequest = proxy.__get__('handleRequest');
      Proxy = proxy.__get__('Proxy');
      Allowed_hosts = proxy__get__('Allowed_hosts');
      spyOn(http, 'createServer').andReturn({listen: function(){}, close: function(){}});


    });

    it('should properly set Proxy and Allowed_hosts globals', function(){
      console.log(Proxy);
    });

    it('should call http.createServer with the correct listener',function(){

    });

  });

  xit('should have a functioning createServer method', function() {
    var http = proxy.__get__('http');
    spyOn(http, 'createServer').andReturn({listen: function(){}, close: function(){}});
    var handleRequest = proxy.__get__('handleRequest');
    var allowed_hosts = {'wwwmattjaycom': {status: 'enabled', blacklist: []}};
    proxy.__set__('Allowed_hosts', allowed_hosts);
    var domain = 'wwwmattjaycom';
    var ip = '1.2.3.4';
    var time = '1000';
    var that = proxy();
    spyOn(that, 'startServer').andCallThrough();
    spyOn(that, 'stopServer').andCallThrough();
    spyOn(that, 'addBlackListIP').andCallThrough();
    spyOn(that, 'getRequests').andCallThrough();
    var server = that.server;
    spyOn(server, 'listen');
    spyOn(server, 'close');

    expect(http.createServer).toHaveBeenCalled();
    expect(http.createServer).toHaveBeenCalledWith(handleRequest);
    expect(that).toBeDefined();
    expect(that.startServer).toBeDefined();
    expect(typeof(that.startServer)).toBe('function');
    expect(that.stopServer).toBeDefined();
    expect(typeof(that.stopServer)).toBe('function');
    that.startServer();
    expect(server.listen).toHaveBeenCalled();
    that.stopServer();
    expect(server.close).toHaveBeenCalled();
    expect(that.addBlackListIP).toBeDefined();
    expect(typeof(that.addBlackListIP)).toBe('function');
    expect(allowed_hosts[domain].blacklist.length).toBe(0);
    that.addBlackListIP(domain, ip, time);
    expect(allowed_hosts[domain].blacklist[0]).toBe({ip: time});
    expect(that.getRequests).toBeDefined();
    expect(typeof(that.getRequests)).toBe('function');
    var requests = that.getRequests();
    expect(requests.length).toBeDefined();
  });

});
