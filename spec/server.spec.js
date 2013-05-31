var app = require('../app/server');

describe("app", function(){
  
  it("should be a function", function(){
    expect(typeof(app)).toBe('function');
  });

  it("should have a listen method", function(){
    expect(typeof(app.listen)).toBe('function');
  });

  it("should have a use method", function(){
    expect(typeof(app.use)).toBe('function');
  });

  it("should have a stack object", function(){
    expect(typeof(app.stack)).toBe('object');
  });

  it("should have a static route configured", function(){
    expect(typeof(app.stack[2].handle)).toBe('function');
    expect(app.stack[2].handle.name).toBe('static');
  });

  it("should have bodyparser endabled", function(){
    expect(typeof(app.stack[3].handle)).toBe('function');
    expect(app.stack[3].handle.name).toBe('bodyParser');	    
  });

  it("should have router enabled", function(){
    expect(typeof(app.routes)).toBe('object');
    var routes = 0;
    for (item in app.routes){
      routes = routes + 1;
    }
    expect(routes).not.toBe(0);
  });

  it("should have a GET route to  /domains that calls the getDomains function", function(){
    expect(app.routes.get[0].path).toBe('/domains');
    expect(app.routes.get[0].callbacks[0].name).toBe('getDomains');
  });

  it("should have a POST route to /domains/info that calls the drillDown function", function(){
    expect(app.routes.post[0].path).toBe('/domains/info');
    expect(app.routes.post[0].callbacks[0].name).toBe('drillDown');
  });

  it("should have a POST route to /domains/attacks that calls the getAttacks function", function(){
    expect(app.routes.post[1].path).toBe('/domains/attacks');
    expect(app.routes.post[1].callbacks[0].name).toBe('getAttacks');
  });
});
