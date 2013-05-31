exports.getDNS = getDNS;
var dns = require('dns');

function getDNS(domain, lookups, callback){
  'use strict';

  var dnsObj = {'domainName': domain},
      lookupcounter = 0;

  var resolve = function(rectype){
    dns.resolve(domain, rectype, function (err, addresses) {
      if (err) {
        if (err.errno === dns.NODATA){
          dnsObj[rectype] = ['No '+rectype+' entry'];
        } //console.log("No TXT entry for "+ domain);
        else {
          callback(err, dnsObj);
        }
        lookupcounter = lookupcounter + 1;
      }
      else {
        //console.log(rectype + ": " + JSON.stringify(addresses));
        dnsObj[rectype] = addresses;
        //console.log(dnsObj);
        lookupcounter = lookupcounter + 1;
        if (rectype === 'A'){
          var ips = addresses;
          addresses.forEach(function (a) {
          dns.reverse(a, function (err, domains) {
            if (err) {
              throw err;
            }
            //console.log('reverse for ' + a + ': ' + JSON.stringify(domains));
            dnsObj['reverse'] = JSON.stringify(domains);
            //console.log(dnsObj);
          });
        });
      }
    }
    if (lookupcounter === lookups.length){
      callback(null,dnsObj);
    }
    });
  };

  lookups.forEach(function(a){
    resolve(a);
  });
}
