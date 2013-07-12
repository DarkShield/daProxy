//check for attack & write to db
var db = require('./requestWriter');
var inspect = require('./waf/inspectors/inspect');
var xss = require('./waf/inspectors/xss');

function check(reqObj){
  //console.log('log3 - attack.check');
  reqObj.attack = 'false';
  reqObj.attacks = [];
//TODO Test this shit

  var xssResult = inspect(reqObj, xss);
  //var sqliResult = inspect(reqObj, sqli);

  if (xssResult != 'No Match') {
    reqObj.attacks.push(xssResult);
  }

  db.requestWriter(reqObj);
}

exports.check = check;
