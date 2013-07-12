//check for attack & write to db
var db = require('./requestWriter');
var inspect = require('./waf/inspectors/inspect');
var xss = require('./waf/inspectors/xss');

function check(reqObj){
  reqObj.attack = 'false';
  reqObj.attacks = [];

  var xssResult = inspect(reqObj, xss);
  //var sqliResult = inspect(reqObj, sqli);

  if (xssResult != 'No Match') {
    reqObj.attacks.push(xssResult);
  }

  db.requestWriter(reqObj);
}

exports.check = check;
