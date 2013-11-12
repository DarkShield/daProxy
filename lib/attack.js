//check for attack & write to db
var db = require('./requestWriter');
var inspect = require('./waf/inspectors/inspect');
var xss = require('./waf/inspectors/xss');
var sqli = require('./waf/inspectors/sqli');
var dirTrav = require('./waf/inspectors/dirTrav');

function check(reqObj) {
  //Start off assuming no attack
  reqObj.attack = 'false';
  reqObj.attacks = [];

  //Inspect for each type of vulnerability
  var xssResult = inspect(reqObj, xss);
  var sqliResult = inspect(reqObj, sqli);
  var dirTravResult = inspect(reqObj, dirTrav);

  //If an attack was found, push to the attacks array in the request object
  if (xssResult !== 'No Match') {
    reqObj.attacks.push(xssResult);
  }

  if (sqliResult !== 'No Match') {
    reqObj.attacks.push(sqliResult);
  }

  if (dirTravResult !== 'No Match') {
    reqObj.attacks.push(dirTravResult);
  }

  //Only write the POST body to the db if there is an attack present
  if (reqObj.attack === 'true') {
    db.requestWriter(reqObj);
  }
  else {
    reqObj.body = '';
    db.requestWriter(reqObj);
  }
}

exports.check = check;
