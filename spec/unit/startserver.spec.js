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
});