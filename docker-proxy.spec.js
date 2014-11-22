/**
 * Created by mattjohansen on 12/16/13.
 */
var request = require('request');
var port = 5555;

console.log('running');

describe('Proxyserver', function() {

  it('can request mattjay.com', function() {
    var gotRes = false;
    var result = {};
    runs(function() {
      request({
        method: 'GET',
        uri: 'http://www.mattjay.com',
        proxy: 'http://localhost:'+port,
        followRedirect: false
      }, function(e, r) {
        gotRes = true;
        if(e !== null){
          result['statusCode'] = e;
        }else{
          result = r;
        }
      });
    });

    waitsFor(function() {
      return gotRes;
    }, "There should be a response", 10000);

    runs(function(){
      expect(result.statusCode).toBe(302);
    });
  });

  it('gets the correct response from mattjay.com with an xss', function() {
    var querystring = 'test=<script>';
    var gotRes = false;
    var result = {};
    runs(function() {
      request({
        method: 'GET',
        uri: 'http://www.mattjay.com/?' + querystring,
        proxy: 'http://localhost:'+port,
        followRedirect: false
      }, function(e, r) {
        gotRes = true;
        if(e !== null){
          result['statusCode'] = e;
        }else{
          result = r;
        }
      });
    });

    waitsFor(function() {
      return gotRes;
    }, "There should be a response", 10000);

    runs(function(){
      expect(result.statusCode).toBe(406);
    });
  });

  it('gets a correct response from supercroppers with path traversal', function() {
    var gotRes = false;
    var result = {};
    runs(function() {
      request({
        method: 'GET',
        uri: 'http://supercroppers.com/testing/directory/../test',
        proxy: 'http://localhost:'+port,
        followRedirect: false
      }, function(e, r) {
        gotRes = true;
        if(e !== null){
          result['statusCode'] = e;
        }else{
          result = r;
        }
      });
    });

    waitsFor(function() {
      return gotRes;
    }, "There should be a response", 5000);

    runs(function(){
      expect(result.statusCode).toBe(200);
    });
  });

  it('gets a correct response from www.mattjay.com with SQLi', function() {
    var gotRes = false;
    var result = {};
    runs(function() {
      request({
        method: 'GET',
        uri: "http://www.mattjay.com/?test='OR+1=1",
        proxy: 'http://localhost:'+port,
        followRedirect: false
      }, function(e, r) {
        gotRes = true;
        if(e !== null){
          result['statusCode'] = e;
        }else{
          result = r;
        }
      });
    });

    waitsFor(function() {
      return gotRes;
    }, "There should be a response", 10000);

    runs(function(){
      expect(result.statusCode).toBe(406);
    });
  });

  it('gets a correct response from supercroppers', function() {
    var gotRes = false;
    var result = {};
    runs(function() {
      request({
        method: 'GET',
        uri: 'http://www.supercroppers.com',
        proxy: 'http://localhost:'+port,
        followRedirect: false
      }, function(e, r) {
        gotRes = true;
        if(e !== null){
          result['statusCode'] = e;
        }else{
          result = r;
        }
      });
    });

    waitsFor(function() {
      return gotRes;
    }, "There should be a response", 5000);

    runs(function(){
      expect(result.statusCode).toBe(200);
    });
  });

  it('gets a correct response from www.mattjay.com with an xss and long request', function() {
    var querystring = 'test=<script>as;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;iaejfwejas;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;as;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;iaejfwejas;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;as;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;iaejfwejas;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;as;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;iaejfwejas;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;as;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;iaejfwejas;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;as;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;iaejfwejas;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;as;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;iaejfwejas;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;as;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;iaejfwejas;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;as;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;iaejfwejas;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;as;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;iaejfwejas;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;as;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;iaejfwejas;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;as;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;iaejfwejas;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;';
    var gotRes = false;
    var result = {};
    runs(function() {
      request({
        method: 'GET',
        uri: 'http://www.mattjay.com.org/?' + querystring,
        proxy: 'http://localhost:'+port,
        followRedirect: false
      }, function(e, r) {
        gotRes = true;
        if(e !== null){
          result['statusCode'] = e;
        }else{
          result = r;
        }
      });
    });

    waitsFor(function() {
      return gotRes;
    }, "There should be a response", 5000);

    runs(function(){
      expect(result.statusCode).toBe(404);
    });
  });

  it('gets a correct response from google', function() {
    var gotRes = false;
    var result = {};
    runs(function() {
      request({
        method: 'GET',
        uri: 'http://www.google.com',
        proxy: 'http://localhost:'+port,
        followRedirect: false
      }, function(e, r) {
        gotRes = true;
        if(e !== null){
          result['statusCode'] = e;
        }else{
          result = r;
        }
      });
    });

    waitsFor(function() {
      return gotRes;
    }, "There should be a response", 5000);

    runs(function(){
      expect(result.statusCode).toBe(404);
    });
  });

  it('gets a correct response form www.mattjay.com with a POST request xss', function() {
    var gotRes = false;
    var result = {};
    runs(function() {
      request({
        method: 'POST',
        uri: 'http://www.mattjay.com/jimmie',
        headers: {'cookie': 'dstc=123456; weirdcookie=something%C4%97%'},
        body: 'teset',
        proxy: 'http://localhost:'+port,
        followRedirect: false
      }, function(e, r) {
        gotRes = true;
        if(e !== null){
          result['statusCode'] = e;
        }else{
          result = r;
        }
      });
    });

    waitsFor(function() {
      return gotRes;
    }, "There should be a response", 5000);

    runs(function(){
      expect(result.statusCode).toBe(406);
    });
  });

  it('gets a correct response from a POST request xss with long payload', function() {
    var body = '<script>as;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;iaejfwejas;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;iaejfwejas;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;iaejfwejas;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;iaejfwejas;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;iaejfwejas;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;iaejfwejas;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;iaejfwejas;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;iaejfwejas;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;iaejfwejas;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;iaejfwejas;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;iaejfwejas;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;iaejfwejas;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;iaejfwej</script>';
    var gotRes = null;
    var result = {};

    runs(function() {
      request({
        method: 'POST',
        uri: 'http://www.mattjay.com.org/jimmie',
        proxy: 'http://localhost:'+port,
        headers: {'cookie': 'dstc=123456; weirdcookie=something%C4%97%'},
        body: body,
        followRedirect: false
      }, function(e, r) {
        gotRes = true;
        if(e !== null){
          result['statusCode'] = e;
        }else{
          result = r;
        }
      });
    });

    waitsFor(function() {
      return gotRes;
    }, "There should be a response", 5000);

    runs(function(){
      expect(result.statusCode).toBe(404);
    });
  });

});