//check for attack & write to db
var db = require('./requestWriter');
var inspect = require('./waf/inspectors/inspect');
var xss = require('./waf/inspectors/xss');
var sqli = require('./waf/inspectors/sqli');
var dirTrav = require('./waf/inspectors/dirTrav');

function check(reqObj) {
  reqObj.attack = 'false';
  reqObj.attacks = [];

  var xssResult = inspect(reqObj, xss);
  var sqliResult = inspect(reqObj, sqli);
  var dirTravResult = inspect(reqObj, dirTrav);

  if (xssResult != 'No Match') {
    reqObj.attacks.push(xssResult);
  }

  if (sqliResult != 'No Match') {
    reqObj.attacks.push(sqliResult);
  }

  if (dirTravResult != 'No Match') {
    reqObj.attacks.push(dirTravResult);
  }

  db.requestWriter(reqObj);
}

exports.check = check;
