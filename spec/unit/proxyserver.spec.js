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
    var outBoundCookies = ['dstc=1234'];

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

});
