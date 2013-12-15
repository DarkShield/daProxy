var mongoose = require('mongoose');
var Host = require('../lib/hostSchema');
var mitmproxy = require('../lib/proxyserver');
var request = require('request');
//var db = new mongoose.Mongoose();
var proxy = null;
var port = 8080;
var verbose = true;
var res;

describe('Proxyserver', function() {

  /*if (process.env.NODE_ENV === 'test') {
    db.connect('10.192.198.253', 'proxytest');
  }
  else {*/
    mongoose.connect('localhost', 'vicetest');
  //}
  proxy = mitmproxy({
    proxy_port: 8080,
    verbose: true,
    hosts: {
      urbanhydroorg:'enabled',
      wwwurbanhydroorg: 'enabled',
      wwwsupercropperscom: 'enabled',
      supercropperscom:'enabled',
      wwwyourbrainprojectcom:'enabled'
    }
  });
  proxy.startServer();

  it('should be a function', function() {
    expect(typeof(mitmproxy)).toBe('function');
  });

  it('should return an object when called', function() {
    expect(typeof(proxy)).toBe('object');
  });

  it('should have a startServer and stopServer method', function() {
    expect(proxy.startServer).toBeDefined();
    expect(typeof(proxy.startServer)).toBe('function');
    expect(proxy.stopServer).toBeDefined();
    expect(typeof(proxy.stopServer)).toBe('function');
  });

  it('has the correct port & verbose values', function() {
    expect(port).toEqual(proxy.options.proxy_port);
    expect(verbose).toEqual(proxy.options.verbose);
  });

  it('can request properly when the servers are running', function() {
    runs(function() {
      res = null;
      request({
        method: 'GET',
        uri: 'http://urbanhydro.org',
        proxy: 'http://localhost:8080',
        followRedirect: false
      }, function(e, r, b) {
        console.log(r.statusCode);
        res = r;
      })
    }, 2000);
    waitsFor(function() {
      return res;
    }, "Response", 2100);
    runs(function() {
      expect(res.statusCode).toBe(200);
    });


    /*
    request({
      method: 'GET',
      uri: 'http://www.urbanhydro.org/?test=<script>',
      proxy: 'http://localhost:8080',
      followRedirect: false
    }, function(e, r, b) {
      expect(r.statusCode).toBe(301);
    });
    request({
      method: 'GET',
      uri: 'http://www.yourbrainproject.com',
      proxy: 'http://localhost:8080',
      followRedirect: false
    }, function(e, r, b) {
      expect(r.statusCode).toBe(200);
    });
    request({
      method: 'GET',
      uri: 'http://supercroppers.com/testing/directory/../test',
      proxy: 'http://localhost:8080',
      followRedirect: false
    }, function(e, r, b) {
      expect(r.statusCode).toBe(301);
    });
    request({
      method: 'GET',
      uri: "http://urbanhydro.org/?test='OR+1=1",
      proxy: 'http://localhost:8080',
      followRedirect: false
    }, function(e, r, b) {
      expect(r.statusCode).toBe(200);
    });
    request({
      method: 'GET',
      uri: 'http://supercroppers.com/wizbangs.php',
      proxy: 'http://localhost:8080',
      followRedirect: false
    }, function(e, r, b) {
      expect(r.statusCode).toBe(301);
    });
    request({
      method: 'GET',
      uri: 'http://www.supercroppers.com',
      proxy: 'http://localhost:8080',
      followRedirect: false
    }, function(e, r, b) {
      expect(r.statusCode).toBe(200);
    });
    request({
      method: 'GET',
      uri: 'http://urbanhydro.org/?test=<script>as;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;iaejfwejas;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;as;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;iaejfwejas;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;as;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;iaejfwejas;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;as;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;iaejfwejas;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;as;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;as;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;iaejfwejas;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;as;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;iaejfwejas;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;as;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;iaejfwejas;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;as;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;iaejfwejas;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;as;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;',
      proxy: 'http://localhost:8080',
      followRedirect: false
    }, function(e, r, b) {
      expect(r.statusCode).toBe(200);
    });
    request({
      method: 'GET',
      uri: 'http://www.google.com',
      proxy: 'http://localhost:8080',
      followRedirect: false
    }, function(e, r, b) {
      expect(r.statusCode).toBe(404);
    });
    request({
      method: 'GET',
      uri: 'http://urbanhydro.org/?test=<script>',
      proxy: 'http://localhost:8080',
      followRedirect: false
    }, function(e, r, b) {
      expect(r.statusCode).toBe(200);
    });
    request({
      method: 'POST',
      uri: 'http://urbanhydro.org/jimmie',
      body: '<script></script>',
      proxy: 'http://localhost:8080',
      followRedirect: false
    }, function(e, r, b) {
      expect(r.statusCode).toBe(404);
    });
    request({
      method: 'POST',
      uri: 'http://urbanhydro.org/jimmie',
      body: '<script>as;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;iaejfwejas;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;as;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;iaejfwejas;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;as;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;iaejfwejas;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;as;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;iaejfwejas;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;as;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;as;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;iaejfwejas;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;as;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;iaejfwejas;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;as;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;iaejfwejas;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;as;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;iaejfwejas;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;gaeoiffo;as;lfknerwv;mfragmv;limvae;lgmervowoaifjera;gjearf;lajr;</script>',
      proxy: 'http://localhost:8080',
      followRedirect: false
    }, function(e, r, b) {
      expect(r.statusCode).toBe(404);
    });*/
  });

});