var attack = require('../../lib/attack');
var db = require('../../lib/requestWriter');

describe('Attack check & DB write', function() {

  it('should have a check funciton', function() {
    expect(attack.check).toBeDefined();
    expect(typeof(attack.check)).toBe('function');
  });

  it('builds correct reqObj when no attack present', function() {
    var reqObj = {url: 'http://www.example.com', body: 'name=value'};
    spyOn(db, 'requestWriter');

    attack.check(reqObj);
    expect(reqObj.attacks.length).toEqual(0);
    expect(reqObj.body).toEqual('');
    expect(db.requestWriter).toHaveBeenCalled();
  });

  it('builds correct reqObj when XSS attack is present', function() {
    var reqObj = {url: 'http://www.example.com/q=<script>', body: 'name=value'};
    spyOn(db, 'requestWriter');

    attack.check(reqObj);
    expect(reqObj.attacks.length).not.toEqual(0);
    expect(reqObj.body).toEqual('name=value');
    expect(db.requestWriter).toHaveBeenCalled();
  });

  it('builds correct reqObj when SQL attack is present', function() {
    var reqObj = {url: 'http://www.example.com/q=1--', body: ''};
    spyOn(db, 'requestWriter');

    attack.check(reqObj);
    expect(reqObj.attacks.length).not.toEqual(0);
    expect(db.requestWriter).toHaveBeenCalled();
  });

  it('builds correct reqObj when Dir Trav attack is present', function() {
    var reqObj = {url: 'http://www.example.com/../', body: ''};
    spyOn(db, 'requestWriter');

    attack.check(reqObj);
    expect(reqObj.attacks.length).not.toEqual(0);
    expect(db.requestWriter).toHaveBeenCalled();
  });

  it('builds correct reqObj when RCE attack is present', function() {
    var reqObj = {url: 'http://www.example.com/cgi-bin/php?-d+allow_url_include=on+-d+safe_mode=off+-d+suhosin.simulation=on+-d+disable_functions=""+-d+open_basedir=none+-d+auto_prepend_file=php://input+-d+cgi.force_redirect=0+-d+cgi.redirect_status_env=0+-n', body: ''};
    spyOn(db, 'requestWriter');

    attack.check(reqObj);
    expect(reqObj.attacks.length).not.toEqual(0);
    expect(db.requestWriter).toHaveBeenCalled();
  });

});
