/*
Each DNS query can return one of the following error codes:
 •	dns.NODATA: DNS server returned answer with no data.
 •	dns.FORMERR: DNS server claims query was misformatted.
 •	dns.SERVFAIL: DNS server returned general failure.
 •	dns.NOTFOUND: Domain name not found.
 •	dns.NOTIMP: DNS server does not implement requested operation.
 •	dns.REFUSED: DNS server refused query.
 •	dns.BADQUERY: Misformatted DNS query.
 •	dns.BADNAME: Misformatted domain name.
 •	dns.BADFAMILY: Unsupported address family.
 •	dns.BADRESP: Misformatted DNS reply.
 •	dns.CONNREFUSED: Could not contact DNS servers.
 •	dns.TIMEOUT: Timeout while contacting DNS servers.
 •	dns.EOF: End of file.
 •	dns.FILE: Error reading file.
 •	dns.NOMEM: Out of memory.
 •	dns.DESTRUCTION: Channel is being destroyed.
 •	dns.BADSTR: Misformatted string.
 •	dns.BADFLAGS: Illegal flags specified.
 •	dns.NONAME: Given hostname is not numeric.
 •	dns.BADHINTS: Illegal hints flags specified.
 •	dns.NOTINITIALIZED: c-ares library initialization not yet performed.
 •	dns.LOADIPHLPAPI: Error loading iphlpapi.dll.
 •	dns.ADDRGETNETWORKPARAMS: Could not find GetNetworkParams function.
 •	dns.CANCELLED: DNS query cancelled.
 */

var vows = require('vows'),
	dns = require('./../lib/dns'),
	assert = require('assert');

vows.describe('DNS Lookup').addBatch({
	'when looking up TXT record for urbanhydro.org':{
		topic: function(){
			dns.getDNS('urbanhydro.org', ['TXT'], this.callback);
		},
		'we get an object': assertObject(),
		'it is not empty': notEmpty(),
		'it contains an array TXT entry': function (err, dnsobj){
			assert.isArray(dnsobj.TXT);
		}
	},
	'when looking up TXT record for supercroppers.com':{
		topic: function(){
			dns.getDNS('supercroppers.com', ['TXT'], this.callback);
		},
		'we get an object': assertObject(),
		'it is not empty': function (err, dnsobj){
			assert.isNotZero (dnsobj.size);
		},
		'it contains a array TXT entry': function (err, dnsobj){
			assert.isNotNull (dnsobj.TXT);
			assert.isArray(dnsobj.TXT);
		}
	},
	'when looking up TXT record for mattjay.com':{
		topic: function(){
			dns.getDNS('mattjay.com', ['TXT'], this.callback);
		},
		'we get an object': assertObject(),
		'it is not empty': function (err, dnsobj){
			assert.isNotZero (dnsobj.size);
		},
		'it contains an array TXT entry': function (err, dnsobj){
			assert.isNotNull (dnsobj.TXT);
			assert.isArray(dnsobj.TXT);
		}
	},
	'when looking up MX record for urbanhydro.org':{
		topic: function(){
			dns.getDNS('urbanhydro.org', ['MX'], this.callback);
		},
		'we get an object': assertObject(),
		'it is not empty': function (err, dnsobj){
			assert.isNotZero (dnsobj.size);
		},
		'it contains an array MX entry': function (err, dnsobj){
			assert.isArray(dnsobj.MX);
		}
	},
	'when looking up A record for urbanhydro.org':{
		topic: function(){
			dns.getDNS('urbanhydro.org', ['A'], this.callback);
		},
		'we get an object': assertObject(),
		'it is not empty': function (err, dnsobj){
			assert.isNotZero (dnsobj.size);
		},
		'it contains an array A entry': function (err, dnsobj){
			assert.isArray(dnsobj.A);
		}
	},
	'when looking up CNAME record for urbanhydro.org':{
		topic: function(){
			dns.getDNS('urbanhydro.org', ['CNAME'], this.callback);
		},
		'we get an object': assertObject(),
		'it is not empty': function (err, dnsobj){
			assert.isNotZero (dnsobj.size);
		},
		'it contains an array CNAME entry': function (err, dnsobj){
			assert.isArray(dnsobj.CNAME);
		}
	},
	'when looking up AAAA record for urbanhydro.org':{
		topic: function(){
			dns.getDNS('urbanhydro.org', ['AAAA'], this.callback);
		},
		'we get an object': assertObject(),
		'it is not empty': function (err, dnsobj){
			assert.isNotZero (dnsobj.size);
		},
		'it contains an array AAAA entry': function (err, dnsobj){
			assert.isArray(dnsobj.AAAA);
		}
	},
	'when looking up SRV record for urbanhydro.org':{
		topic: function(){
			dns.getDNS('urbanhydro.org', ['SRV'], this.callback);
		},
		'we get an object': assertObject(),
		'it is not empty': function (err, dnsobj){
			assert.isNotZero (dnsobj.size);
		},
		'it contains an array SRV entry': function (err, dnsobj){
			assert.isArray(dnsobj.SRV);
		}
	},
	'when looking up NS record for urbanhydro.org':{
		topic: function(){
			dns.getDNS('urbanhydro.org', ['NS'], this.callback);
		},
		'we get an object': assertObject(),
		'it is not empty': function (err, dnsobj){
			assert.isNotZero (dnsobj.size);
		},
		'it contains an array NS entry': function (err, dnsobj){
			assert.isArray(dnsobj.NS);
		}
	}
}).export(module);

function assertObject(){
    return function (err, dnsobj){
        assert.isNull(err);
        assert.isObject(dnsobj);
        //console.log(dnsobj);
    }
}

function notEmpty(){
    return function (err, dnsobj){
        assert.isNotZero (dnsobj.size);
    }
}