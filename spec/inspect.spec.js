var inspect = require('../lib/waf/inspectors/inspect');
var xss = require('../lib/waf/inspectors/xss');
var sqli = require('../lib/waf/inspectors/sqli');

describe('Inspect Function', function() {

  it('should be a function', function() {
    expect(typeof(inspect)).toBe('function');
  });

  it('should return No Match when passed a clean URL', function(){
    var reqObj = {url: 'http://www.example.com/', body: ''};
    var result = inspect(reqObj, xss);

    expect(result).toBe('No Match');
  });

  it('should return No Match when passed a clean body', function(){
    var reqObj = {url: 'http://www.example.com/', body: 'q=test'};
    var result = inspect(reqObj, xss);

    expect(result).toBe('No Match');
  });

  it('should return a match object when passed a script tag in URL', function() {
    var reqObj = {url: 'http://www.example.com?q=<script>', body: ''};
    var result = inspect(reqObj, xss);

    expect(result.type).toBe('XSS');
    expect(result.ids[0]).toBe(1);
    expect(result.matches[0][0]).toBe('<script>');
    expect(result.score).toBe(10);
  });

  it('should return a match object when passed a sql comment character', function() {
    var reqObj = {url: 'http://www.example.com?q=1--', body: ''};
    var result = inspect(reqObj, sqli);

    expect(result.type).toBe('SQLi');
    expect(result.ids[0]).toBe(1);
    expect(result.matches[0][0]).toBe('=1--');
    expect(result.score).toBe(1);
  });

});
