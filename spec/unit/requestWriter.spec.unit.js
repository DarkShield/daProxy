/**
 * Created by mattjohansen on 6/19/14.
 */
var rewire = require("rewire");
var requestWriter = rewire('../../lib/requestWriter');

describe('requestWriter', function() {

  it('should have a logSave method that works when there is an error', function() {
    var logSave = requestWriter.__get__('logSave');
    var err = 'exists';
    var sys = requestWriter.__get__('sys');
    spyOn(sys, 'log');

    expect(typeof(logSave)).toBe('function');
    logSave(err);
    expect(sys.log).toHaveBeenCalledWith('error');
  });

  it('should have a logSave method that works when there is not an error', function() {
    var logSave = requestWriter.__get__('logSave');
    var err = null;
    var sys = requestWriter.__get__('sys');
    spyOn(sys, 'log');

    expect(typeof(logSave)).toBe('function');
    logSave(err);
    expect(sys.log).toHaveBeenCalledWith('saved');
  });

  it('should have a working requestWriter method', function() {
    var reqObj = {};
    var request = requestWriter.__get__('request');
    var obj = {request: request};
    var mocksave = jasmine.createSpy('save');
    spyOn(obj, 'request').andReturn({save: mocksave});
    requestWriter.__set__('request', obj.request);
    requestWriter.requestWriter(reqObj);

    expect(typeof(requestWriter.requestWriter)).toBe('function');
    expect(obj.request).toHaveBeenCalled();
    expect(mocksave).toHaveBeenCalled();
  });

});