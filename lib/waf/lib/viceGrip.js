//initate checks

var csrf = require('./inspectors/csrf');

exports.waf = function(req, vulns){
    //fire off checks
    for (var i = 0; i < vulns.length; i++) {
        if (vulns[i] = 'csrf'){
            csrf.check(req);
        }
    }
};