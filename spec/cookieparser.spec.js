/**
 * Created by mattjohansen on 1/26/14.
 */
var cp = require('../lib/cookieparser');

describe('cookie parser unit tests', function() {

  it('should exist', function() {
    expect(cp).toBeDefined();
    expect(typeof(cp)).toBe('function');
  });

  it('should parse cookies correctly', function() {
    var req = {
      headers: {
        cookie: 'dstc=123456;other=abcdefg;'
      }
    };
    var cookies = cp(req);

    expect(cookies).toBeDefined();
    expect(typeof(cookies)).toBe('object');
    expect(cookies.dstc).toBe('123456');
    expect(cookies.other).toBe('abcdefg');
  });
});