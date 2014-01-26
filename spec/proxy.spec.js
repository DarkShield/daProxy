var mongoose = require('mongoose');
//var Host = require('../lib/hostSchema');
var httpProxy = require('http-proxy');
var createServer = require('../lib/proxyserver');
var request = require('request');
var proxy = null;
var server = null;
var port = 8080;
var verbose = true;
var res;
var allowed_hosts = {
  urbanhydroorg:'enabled',
  wwwurbanhydroorg: 'enabled',
  wwwsupercropperscom: 'enabled',
  supercropperscom:'enabled',
  wwwyourbrainprojectcom:'enabled'
};

describe('Proxyserver', function() {

  console.log(process.env.NODE_ENV);
  if (process.env.NODE_ENV === 'development') {
    mongoose.connect('localhost', 'vicetest');
  }
  else if (process.env.NODE_ENV === 'production') {
    mongoose.connect('10.136.20.210', 'vicetest');
  }
  else {
    mongoose.connect('10.136.20.210', 'proxytest');
  }
  proxy = httpProxy.createProxyServer();
  server = createServer(proxy, allowed_hosts, port);

  beforeEach(function() {
    server.startServer();
  });

  afterEach(function() {
    server.stopServer();
  })

  it('should be a function', function() {
    expect(typeof(createServer)).toBe('function');
  });

  it('should return an object when called', function() {
    expect(typeof(server)).toBe('object');
  });

  it('should have a startServer and stopServer method', function() {
    expect(server.startServer).toBeDefined();
    expect(typeof(server.startServer)).toBe('function');
    expect(server.stopServer).toBeDefined();
    expect(typeof(server.stopServer)).toBe('function');
  });

  it('can request urbanhydro', function() {
    runs(function() {
      res = null;
      request({
        method: 'GET',
        uri: 'http://urbanhydro.org',
        proxy: 'http://localhost:8080',
        followRedirect: false
      }, function(e, r, b) {
        expect(r.statusCode).toBe(200);
        expect(r.headers['set-cookie']).toBeDefined();
        expect(r.headers['set-cookie'][0]).toMatch(/dstc/);
        res = r;
      })
    }, 5000);
    waitsFor(function() {
      return res;
    }, "Response", 10000);
  });

  it('gets the correct response from urbanhydro with an xss', function() {
    var querystring = 'test=<script>';
    runs(function() {
      res = null;
      request({
        method: 'GET',
        uri: 'http://www.urbanhydro.org/?' + querystring,
        proxy: 'http://localhost:8080',
        followRedirect: false
      }, function(e, r, b) {
        expect(r.statusCode).toBe(301);
        expect(r.headers['set-cookie']).toBeDefined();
        expect(r.headers['set-cookie'][0]).toMatch(/dstc/);
        res = r;
      })
    }, 5000);
    waitsFor(function() {
      return res;
    }, "Response", 10000);
  });

  it('gets a correct response from yourbrainproject', function() {
    runs(function() {
      res = null;
      request({
        method: 'GET',
        uri: 'http://www.yourbrainproject.com',
        proxy: 'http://localhost:8080',
        followRedirect: false
      }, function(e, r, b) {
        expect(r.statusCode).toBe(200);
        expect(r.headers['set-cookie']).toBeDefined();
        expect(r.headers['set-cookie'][0]).toMatch(/dstc/);
        res = r;
      })
    }, 5000);
    waitsFor(function() {
      return res;
    }, "Response", 10000);
  });

  it('gets a correct response from supercroppers with path traversal', function() {
    runs(function() {
      res = null;
      request({
        method: 'GET',
        uri: 'http://supercroppers.com/testing/directory/../test',
        proxy: 'http://localhost:8080',
        followRedirect: false
      }, function(e, r, b) {
        expect(r.statusCode).toBe(301);
        expect(r.headers['set-cookie']).toBeDefined();
        expect(r.headers['set-cookie'][0]).toMatch(/dstc/);
        res = r;
      })
    }, 5000);
    waitsFor(function() {
      return res;
    }, "Response", 10000);
  });

  it('gets a correct response from urbanhydro with SQLi', function() {
    runs(function() {
      res = null;
      request({
        method: 'GET',
        uri: "http://urbanhydro.org/?test='OR+1=1",
        proxy: 'http://localhost:8080',
        followRedirect: false
      }, function(e, r, b) {
        expect(r.statusCode).toBe(200);
        expect(r.headers['set-cookie']).toBeDefined();
        expect(r.headers['set-cookie'][0]).toMatch(/dstc/);
        res = r;
      })
    }, 5000);
    waitsFor(function() {
      return res;
    }, "Response", 10000);
  });

  it('gets a correct response from supercroppers', function() {
    runs(function() {
      res = null;
      request({
        method: 'GET',
        uri: 'http://www.supercroppers.com',
        proxy: 'http://localhost:8080',
        followRedirect: false
      }, function(e, r, b) {
        expect(r.statusCode).toBe(200);
        expect(r.headers['set-cookie']).toBeDefined();
        expect(r.headers['set-cookie'][0]).toMatch(/dstc/);
        res = r;
      })
    }, 5000);
    waitsFor(function() {
      return res;
    }, "Response", 10000);
  });

  it('gets a correct response from urbanhydro with an xss and long request', function() {
    var querystring = 'test=<script>as;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;iaejfwejas;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;as;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;iaejfwejas;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;as;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;iaejfwejas;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;as;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;iaejfwejas;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;as;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;iaejfwejas;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;as;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;iaejfwejas;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;as;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;iaejfwejas;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;as;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;iaejfwejas;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;as;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;iaejfwejas;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;as;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;iaejfwejas;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;as;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;iaejfwejas;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;as;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;iaejfwejas;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;'

      runs(function() {
      res = null;
      request({
        method: 'GET',
        uri: 'http://urbanhydro.org/?' + querystring,
        proxy: 'http://localhost:8080',
        followRedirect: false
      }, function(e, r, b) {
        expect(r.statusCode).toBe(200);
        expect(r.headers['set-cookie']).toBeDefined();
        expect(r.headers['set-cookie'][0]).toMatch(/dstc/);
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
        proxy: 'http://localhost:8080',
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
        proxy: 'http://localhost:8080',
        followRedirect: false
      }, function(e, r, b) {
        expect(r.statusCode).toBe(404);
        expect(r.headers['set-cookie']).not.toBeDefined();
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
        proxy: 'http://localhost:8080',
        headers: {'cookie': 'dstc=123456; weirdcookie=something%C4%97%'},
        body: body,
        followRedirect: false
      }, function(e, r, b) {
        expect(r.statusCode).toBe(301);
        expect(r.headers['set-cookie']).not.toBeDefined();
        res = r;
      })
    }, 5000);
    waitsFor(function() {
      return res;
    }, "Response", 5100);
  });

  setTimeout(function() {
    console.log('disconnect');
    mongoose.disconnect();
  }, 20000);
});