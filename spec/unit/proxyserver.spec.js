/**
 * Created by mattjohansen on 6/16/14.
 */
var rewire = require("rewire");
var proxy = rewire('../../lib/proxyserver')

describe('Unit, Proxyserver', function() {

  it('should have a functioning appendData method', function() {
    var appendData = proxy.__get__('appendData');
    appendData['body'] = "123";
    var data = "456";
    expect(appendData['body']).toBe("123");
    appendData(data);
    expect(appendData['body']).toBe("123456");

  });

});
