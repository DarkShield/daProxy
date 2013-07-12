var inspect = require('../lib/waf/inspectors/inspect');
var xss = require('../lib/waf/inspectors/xss');

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

    expect(result.matches[0][0]).toBe('<script>');
  });

});
