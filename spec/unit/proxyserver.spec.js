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

});
