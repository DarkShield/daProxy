// dns.js tester
var mongoose = require('mongoose'),
	DNS = require('./dns');

mongoose.connect('localhost', 'vicetest');
var dnsSchema = mongoose.Schema({
	domainName: String,
	insertedOn: {type: Date, default: Date.now},
	A: Array,
	MX: Array,//[{exchange: String, priority: Number}],
	TXT: Array,
	CNAME: Array,
	AAAA: Array,
	SRV: Array,
	NS: Array
	});

var dnstest = mongoose.model('dnstest', dnsSchema);

DNS.getDNS('urbanhydro.org',['TXT','MX', 'A', 'CNAME', 'AAAA', 'SRV', 'NS'], function(err, dnsobj){
	console.log(dnsobj);
	var site = new dnstest(dnsobj);
	site.save(function (err) {
		if (err)
			console.log('error');
		console.log('saved');
	});

});
