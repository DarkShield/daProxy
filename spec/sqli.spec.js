var sqli = require('../lib/waf/inspectors/sqli');

describe('SQLi inspector', function(){
  
  it('should be an object', function(){
    expect(typeof(sqli)).toBe('object');
  });

  it('should have a inspectors property that is an arrary containing at least one object', function(){
    expect(sqli.inspectors).toBeDefined();
    expect(sqli.inspectors[0]).toBeDefined();
    expect(typeof(sqli.inspectors[0])).toBe('object');
  });

  describe('All SQLi Inspectors', function(){	  
    
    for(var x=0;x<sqli.inspectors.length;x++){
      var inspector = sqli.inspectors[x];
      
      it('should have id, name, regex and score properties', function(){
        expect(inspector.id).toBeDefined();
	      expect(inspector.name).toBeDefined();
	      expect(inspector.regex).toBeDefined();
	      expect(inspector.score).toBeDefined();
      });

      it('should have a regex property that is a valid regular expression', function(){
        expect(inspector.regex instanceof RegExp).toBeTruthy();
      });
    };    
  });
  describe('The First SQLi Inspector',function(){
      
    var inspector = sqli.inspectors[0];
    
    describe('The RegEx', function(){  
      
      it('should match when a parameter value contains a single quotation', function(){
        expect(inspector.regex.test('http://www.example.com?q=\'')).toBeTruthy();
        expect(inspector.regex.test('http://www.example.com?q=%27')).toBeTruthy();
      	expect(inspector.regex.test('http://www.example.com?q=test&q=%27')).toBeTruthy();
        expect(inspector.regex.test('http://www.example.com?q=test\'')).toBeTruthy();
	      expect(inspector.regex.test('http://www.example.com?q=1\'')).toBeTruthy();
	      expect(inspector.regex.test('http://www.example.com/test%3D\'')).toBeTruthy();
      });
      
      it('should match when a parameter value contains a sql comment character', function(){
	      expect(inspector.regex.test('http://www.example.com?q=1--')).toBeTruthy();
      });

      it('should match when a parameter value contains a unitary operator', function(){     
	      expect(inspector.regex.test('http://www.example.com?q=%3B')).toBeTruthy();
      });

      it('should match when a parameter value contains a SQL statement terminator', function(){
	      expect(inspector.regex.test('http://www.example.com?q=;')).toBeTruthy();
      });          

      it('should not match this group of shit test cases', function(){
	      expect(inspector.regex.test('http://www.example.com?q=%2527')).not.toBeTruthy()
	      expect(inspector.regex.test('http://www.example.com?q=test')).not.toBeTruthy();
        expect(inspector.regex.test('http://www.example.com?q\'=test')).not.toBeTruthy();
        expect(inspector.regex.test('http://www.example.com/test\'')).not.toBeTruthy();
      });
    });
  });
});
