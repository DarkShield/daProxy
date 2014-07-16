var inspect = require('../../lib/waf/inspectors/inspect');
var xss = require('../../lib/waf/inspectors/xss');
var sqli = require('../../lib/waf/inspectors/sqli');
var dirTrav = require('../../lib/waf/inspectors/dirTrav');
var rce = require('../../lib/waf/inspectors/rce');

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

  it('should return a match object when passed a script tag in POST body', function() {
    var reqObj = {url: 'http://www.example.com', body: 'q=<script>'};
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

  it('should return a match object when passed a path traversal string', function() {
    var reqObj = {url: 'http://www.example.com/news/../', body: ''};
    var result = inspect(reqObj, dirTrav);

    expect(result.type).toBe('dirTrav');
    expect(result.ids[0]).toBe(1);
    expect(result.matches[0][0]).toBe('../');
    expect(result.score).toBe(10);
  });

  it('should return a match object when PHP RCE is detected', function() {
    var reqObj = {url:'/cgi-bin/php?%2D%64+%61%6C%6C%6F%77%5F%75%72%6C%5F%69%6E%63%6C%75%64%65%3D%6F%6E+%2D%64+%73%61%66%65%5F%6D%6F%64%65%3D%6F%66%66+%2D%64+%73%75%68%6F%73%69%6E%2E%73%69%6D%75%6C%61%74%69%6F%6E%3D%6F%6E+%2D%64+%64%69%73%61%62%6C%65%5F%66%75%6E%63%74%69%6F%6E%73%3D%22%22+%2D%64+%6F%70%65%6E%5F%62%61%73%65%64%69%72%3D%6E%6F%6E%65+%2D%64+%61%75%74%6F%5F%70%72%65%70%65%6E%64%5F%66%69%6C%65%3D%70%68%70%3A%2F%2F%69%6E%70%75%74+%2D%64+%63%67%69%2E%66%6F%72%63%65%5F%72%65%64%69%72%65%63%74%3D%30+%2D%64+%63%67%69%2E%72%65%64%69%72%65%63%74%5F%73%74%61%74%75%73%5F%65%6E%76%3D%30+%2D%6E'};
    var result = inspect(reqObj, rce);

    expect(result.type).toBe('RCE');
    expect(result.ids[0]).toBe(1);
    expect(result.matches[0][0]).toBe('/cgi-bin/php?%2D%64+%61%6C%6C%6F%77%5F%75%72%6C%5F%69%6E%63%6C%75%64%65%3D%6F%6E+%2D%64+%73%61%66%65%5F%6D%6F%64%65%3D%6F%66%66+%2D%64+%73%75%68%6F%73%69%6E%2E%73%69%6D%75%6C%61%74%69%6F%6E%3D%6F%6E+%2D%64+%64%69%73%61%62%6C%65%5F%66%75%6E%63%74%69%6F%6E%73%3D%22%22+%2D%64+%6F%70%65%6E%5F%62%61%73%65%64%69%72%3D%6E%6F%6E%65+%2D%64+%61%75%74%6F%5F%70%72%65%70%65%6E%64%5F%66%69%6C%65%3D%70%68%70%3A%2F%2F%69%6E%70%75%74+%2D%64+%63%67%69%2E%66%6F%72%63%65%5F%72%65%64%69%72%65%63%74%3D%30+%2D%64+%63%67%69%2E%72%65%64%69%72%65%63%74%5F%73%74%61%74%75%73%5F%65%6E%76%3D%30+%2D%6E');
    expect(result.score).toBe(10);
  });

  it('should return a match object when PHP RCE decoded is detected', function() {
    var reqObj = {url: '/cgi-bin/php?-d+allow_url_include=on+-d+safe_mode=off+-d+suhosin.simulation=on+-d+disable_functions=""+-d+open_basedir=none+-d+auto_prepend_file=php://input+-d+cgi.force_redirect=0+-d+cgi.redirect_status_env=0+-n', body: ''};
    var result = inspect(reqObj, rce);

    expect(result.type).toBe('RCE');
    expect(result.ids[0]).toBe(2);
    expect(result.matches[0][0]).toBe('/cgi-bin/php?-d+allow_url_include=on+-d+safe_mode=off+-d+suhosin.simulation=on+-d+disable_functions=""+-d+open_basedir=none+-d+auto_prepend_file=php://input+-d+cgi.force_redirect=0+-d+cgi.redirect_status_env=0+-n');
    expect(result.score).toBe(10);
  });

});
