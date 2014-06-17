var xss = require('../lib/waf/inspectors/xss');

describe('XSS inspector', function() {

  it('should have an inspectors property that is an array containing at least one object', function() {
    expect(xss.inspectors).toBeDefined();
    expect(xss.inspectors[0]).toBeDefined();
    expect(typeof(xss.inspectors[0])).toBe('object');
  });

  describe('All XSS Inspectors', function() {

    for(var x=0; x<xss.inspectors.length; x++) {
      var inspector = xss.inspectors[x];

      it('should have id, name, regex, and score properties', function() {
        expect(inspector.id).toBeDefined();
        expect(inspector.name).toBeDefined();
        expect(inspector.regex).toBeDefined();
        expect(inspector.score).toBeDefined();
      });

      it('should have a regex property that is a valid regular expression', function() {
        expect(inspector.regex instanceof RegExp).toBeTruthy();
      });
    }
  });

  describe('Script Tag XSS Inspector', function() {
    var inspector = xss.inspectors[0];

    describe('The Regex', function() {

      it('should match when a parameter contains a script tag', function() {
        expect(inspector.regex.test('http://www.example.com?q=<script>')).toBeTruthy();
      });

      it('should NOT match on this group of tests', function() {
        expect(inspector.regex.test('http://www.example.com')).not.toBeTruthy();
      });
    });  
  });

  //Need a new onevent regex
  /*describe('On Event XSS Inspector', function() {

    var inspector = xss.inspectors[1];

    describe('The Regex', function() {

      it('should match when a parameter contains an on event', function() {
        expect(inspector.regex.test('http://www.example.com?q="onload=prompt();')).toBeTruthy();
      });

      it('should NOT match on this group of tests', function() {
        expect(inspector.regex.test('http://www.example.com')).not.toBeTruthy();
      });
    });
  });*/

  describe('Img Src XSS Inspector', function() {

    var inspector = xss.inspectors[1];

    describe('The Regex', function() {

      it('should match when a parameter contains a javascript URI', function() {
        expect(inspector.regex.test('http://www.example.com?q=<img src>')).toBeTruthy();
      });

      it('should NOT match on this group of tests', function() {
        expect(inspector.regex.test('http://www.example.com?q=javascript')).not.toBeTruthy();
      });

    });
  });

});
