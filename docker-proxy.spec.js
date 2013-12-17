/**
 * Created by mattjohansen on 12/16/13.
 */
var request = require('request');
var port = 5555;
var res;

console.log('running');

describe('Proxyserver', function() {

  it('can request urbanhydro', function() {

    runs(function() {
      gotRes = false;
      result = null;
      request({
        method: 'GET',
        uri: 'http://urbanhydro.org',
        proxy: 'http://localhost:'+port,
        followRedirect: false
      }, function(e, r, b) {
         gotRes = true;
         result = (!e) ? r : e;
      })
    }, 5000);

    waitsFor(function() {
      return gotRes;
    }, "There should be a Response", 2000);

    runs(function(){
      expect(res.statusCode).toBe(200);
    });
  });

  it('gets the correct response from urbanhydro with an xss', function() {
    var querystring = 'test=<script>';
    runs(function() {
      res = null;
      request({
        method: 'GET',
        uri: 'http://www.urbanhydro.org/?' + querystring,
        proxy: 'http://localhost:'+port,
        followRedirect: false
      }, function(e, r, b) {
        expect(r.statusCode).toBe(301);
        res = r;
      })
    }, 5000);
    waitsFor(function() {
      return res;
    }, "Response", 5100);
  });

  it('gets a correct response from yourbrainproject', function() {
    runs(function() {
      res = null;
      request({
        method: 'GET',
        uri: 'http://www.yourbrainproject.com',
        proxy: 'http://localhost:'+port,
        followRedirect: false
      }, function(e, r, b) {
        expect(r.statusCode).toBe(200);
        res = r;
      })
    }, 5000);
    waitsFor(function() {
      return res;
    }, "Response", 5100);
  });

  it('gets a correct response from supercroppers with path traversal', function() {
    runs(function() {
      res = null;
      request({
        method: 'GET',
        uri: 'http://supercroppers.com/testing/directory/../test',
        proxy: 'http://localhost:'+port,
        followRedirect: false
      }, function(e, r, b) {
        expect(r.statusCode).toBe(301);
        res = r;
      })
    }, 5000);
    waitsFor(function() {
      return res;
    }, "Response", 5100);
  });

  it('gets a correct response from urbanhydro with SQLi', function() {
    runs(function() {
      res = null;
      request({
        method: 'GET',
        uri: "http://urbanhydro.org/?test='OR+1=1",
        proxy: 'http://localhost:'+port,
        followRedirect: false
      }, function(e, r, b) {
        expect(r.statusCode).toBe(200);
        res = r;
      })
    }, 5000);
    waitsFor(function() {
      return res;
    }, "Response", 5100);
  });

  it('gets a correct response from supercroppers', function() {
    runs(function() {
      res = null;
      request({
        method: 'GET',
        uri: 'http://www.supercroppers.com',
        proxy: 'http://localhost:'+port,
        followRedirect: false
      }, function(e, r, b) {
        expect(r.statusCode).toBe(200);
        res = r;
      })
    }, 5000);
    waitsFor(function() {
      return res;
    }, "Response", 5100);
  });

  it('gets a correct response from urbanhydro with an xss and long request', function() {
    var querystring = 'test=<script>as;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;iaejfwejas;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;as;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;iaejfwejas;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;as;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;iaejfwejas;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;as;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;iaejfwejas;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;as;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;iaejfwejas;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;as;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;iaejfwejas;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;as;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;iaejfwejas;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;as;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;iaejfwejas;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;as;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;iaejfwejas;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;as;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;iaejfwejas;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;as;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;iaejfwejas;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;as;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;iaejfwejas;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;'

    runs(function() {
      res = null;
      request({
        method: 'GET',
        uri: 'http://urbanhydro.org/?' + querystring,
        proxy: 'http://localhost:'+port,
        followRedirect: false
      }, function(e, r, b) {
        expect(r.statusCode).toBe(200);
        res = r;
      })
    }, 5000);
    waitsFor(function() {
      return res;
    }, "Response", 5100);
  });

  it('gets a correct response from google', function() {
    runs(function() {
      res = null;
      request({
        method: 'GET',
        uri: 'http://www.google.com',
        proxy: 'http://localhost:'+port,
        followRedirect: false
      }, function(e, r, b) {
        expect(r.statusCode).toBe(404);
        res = r;
      })
    }, 5000);
    waitsFor(function() {
      return res;
    }, "Response", 5100);
  });

  it('gets a correct response form urbanhydro with a POST request xss', function() {
    runs(function() {
      res = null;
      request({
        method: 'POST',
        uri: 'http://urbanhydro.org/jimmie',
        headers: {'cookie': 'dstc=123456; weirdcookie=something%C4%97%'},
        body: 'teset',
        proxy: 'http://localhost:'+port,
        followRedirect: false
      }, function(e, r, b) {
        expect(r.statusCode).toBe(404);
        res = r;
      })
    }, 5000);
    waitsFor(function() {
      return res;
    }, "Response", 5100);
  });


  it('gets a correct response from a POST request xss with long payload', function() {
    var body = '<script>as;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;iaejfwejas;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;iaejfwejas;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;iaejfwejas;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;iaejfwejas;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;iaejfwejas;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;iaejfwejas;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;iaejfwejas;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;iaejfwejas;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;iaejfwejas;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;iaejfwejas;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;iaejfwejas;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;iaejfwejas;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;iaejfwej</script>';


    runs(function() {
      res = null;
      request({
        method: 'POST',
        uri: 'http://www.urbanhydro.org/jimmie',
        proxy: 'http://localhost:'+port,
        headers: {'cookie': 'dstc=123456; weirdcookie=something%C4%97%'},
        body: body,
        followRedirect: false
      }, function(e, r, b) {
        expect(r.statusCode).toBe(301);
        res = r;
      })
    }, 5000);
    waitsFor(function() {
      return res;
    }, "Response", 5100);
  });

});