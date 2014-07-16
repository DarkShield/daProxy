var sys = require('sys');

module.exports = function parseCookies (request) {
  var list = {},
    rc = request.headers.cookie;

  rc && rc.split(';').forEach(function( cookie ) {
    var parts = cookie.split('=');
    try {
      list[parts.shift().trim()] = decodeURIComponent(parts.join('='));
    }
    catch (e) {
      sys.log('Cookie URI component, Proxy ' + e);
      list[parts.shift().trim()] = parts.join('=');
    }
  });
  return list;
}
