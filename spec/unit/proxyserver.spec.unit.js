/**
 * Created by mattjohansen on 6/16/14.
 */
var rewire = require("rewire");
var events = require('events');


describe('Unit, Proxyserver', function() {
  var proxy = null

  beforeEach(function(){
    proxy = rewire('../../lib/proxyserver');
  });


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
      setHeader: {bind:jasmine.createSpy('test')}
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
    var response = {setHeader: jasmine.createSpy('test')};
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
    var response = {setHeader: jasmine.createSpy('test')};
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
      on: jasmine.createSpy('test')
    };
    var response = {
      writeHead: jasmine.createSpy('test'),
      end: jasmine.createSpy('test')
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
    proxy.__set__('Proxy', {web: jasmine.createSpy('test')});
    var Proxy = proxy.__get__('Proxy');
    //spyOn(Proxy, 'web');
    //spyOn(request, 'on');

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
      on: jasmine.createSpy('test')
    };
    var response = {
      writeHead: jasmine.createSpy('test'),
      end: jasmine.createSpy('test')
    };
    var handleRequest = proxy.__get__('handleRequest');
    proxy.__set__('Allowed_hosts', {'wwwmattjaycom': 'enabled'});
    //spyOn(response, 'writeHead');
    //spyOn(response, 'end');

    handleRequest(request, response);
    expect(response.writeHead).toHaveBeenCalled();
    expect(response.end).toHaveBeenCalled();
  });

  describe('Proxyserver\'s createServer class', function(){
    var http,handleRequest,allowed_hosts,Allowed_hosts,port,_proxy,Proxy = null

    beforeEach(function(){
      http = proxy.__get__('http');
      Proxy = proxy.__get__('Proxy');
      handleRequest = proxy.__get__('handleRequest');
      Allowed_hosts = proxy.__get__('Allowed_hosts');
      _proxy = {on: 'fakeproxy'};
      allowed_hosts = {'wwwmattjaycom':'enabled'};
      port = 9999;

      spyOn(http, 'createServer').andReturn({listen: jasmine.createSpy('test'), close: jasmine.createSpy('test')});
     });

    it('should properly set Proxy and Allowed_hosts globals', function(){
      expect(Proxy).toBe(null);
      expect(Proxy).not.toBe({on:'fakeproxy'});

      expect(Allowed_hosts).toBe(null);
      expect(Allowed_hosts).not.toEqual({'wwwmattjaycom': 'enabled'});

      _proxy = proxy(_proxy, allowed_hosts, port);
      Proxy = proxy.__get__('Proxy');
      Allowed_hosts = proxy.__get__('Allowed_hosts');
      expect(Proxy).toEqual({on:'fakeproxy'});
      expect(Allowed_hosts).toEqual({'wwwmattjaycom':'enabled'});
    });

    it('should call http.createServer with the correct listener',function(){
      expect(http.createServer).not.toHaveBeenCalled();
      _proxy = proxy(_proxy, allowed_hosts, port);
      expect(http.createServer).toHaveBeenCalledWith(handleRequest);
    });

    it('should return an object with a server property', function(){
      expect(_proxy.server).toBe(undefined);
      _proxy = proxy(_proxy, allowed_hosts, port);
      expect(_proxy.server.listen).toBeDefined();
    });

    it('should return an object with a functioning startServer method', function(){
      expect(_proxy.startServer).toBe(undefined);
      _proxy = proxy(_proxy, allowed_hosts, port);
      expect(typeof _proxy.startServer).toBe('function');

      //spyOn(_proxy.server,'listen');
      _proxy.startServer();
      expect(_proxy.server.listen).toHaveBeenCalledWith(port);
    });

    it('should return an object with a functioning stopServer method', function(){
      expect(_proxy.stopServer).toBe(undefined);
      _proxy = proxy(_proxy, allowed_hosts, port);
      expect(typeof _proxy.stopServer).toBe('function');

      //spyOn(_proxy.server,'close');
      _proxy.stopServer();
      expect(_proxy.server.close).toHaveBeenCalled();
    });

    it('should return an object with a functioning updateBlacklist method', function(){
      allowed_hosts = {'wwwmattjaycom': {status: 'enabled', blacklist: []}};
      expect(_proxy.updateBlacklist).toBeUndefined();

      _proxy = proxy(_proxy, allowed_hosts, port);

      expect(typeof _proxy.updateBlacklist).toBe('function');

      Allowed_hosts = proxy.__get__('Allowed_hosts');
      expect(Allowed_hosts).toEqual({'wwwmattjaycom': {status: 'enabled', blacklist: []}});
      var domain = 'wwwmattjaycom';
      var ip = '1.2.3.4';
      var time = '1000';
      var blacklist = [];
      var obj = {};
      obj[ip] = time;
      blacklist.push(obj);
      _proxy.updateBlacklist(domain, blacklist);
      Allowed_hosts = proxy.__get__('Allowed_hosts');
      expect(Allowed_hosts.wwwmattjaycom.blacklist[0][ip]).toEqual(time);
    });

    it('should return an object with a functioning getRequests method', function(){
      expect(_proxy.getRequests).toBeUndefined();

      _proxy = proxy(_proxy, allowed_hosts, port);

      expect(_proxy.getRequests().length).toBe(0);
    });
  });
});
