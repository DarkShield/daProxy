//check for attack & write to db
var db = require('./requestWriter');
var matches = {};

matches.xss = [/((\%3C)|<)((\%2F)|\/)*[a-z0-9\%]+((\%3E)|>)/i,
               /((\%3C)|<)((\%69)|i|(\%49))((\%6D)|m|(\%4D))((\%67)|g|(\%47))[^n]+((\%3E)|>)/i,
               /((\%3C)|<)[^n]+((\%3E)|>)/i];
matches.sql = [/((\%3D)|(=))[^\n]*((\%27)|(\')|(\-\-)|(\%3B)|(;))/i,
/\w*((\%27)|(\'))((\%6F)|o|(\%4F))((\%72)|r|(\%52))/i,
/((\%27)|(\'))union/i,
/exec(\s|\+)+(s|x)p\w+/i,
/UNION(?:\s+ALL)?\s+SELECT/i];
matches.dt = [/\.\.\//]; 

function check(reqObj){
   //console.log('log3 - attack.check');
   reqObj.attack = 'false';
   for (var i = matches.xss.length - 1; i>=0; --i){
      if (matches.xss[i].test(reqObj.url)) {
         reqObj.attack = 'true';
         reqObj.attackType = 'XSS';
         break;
      }
   }
   for (var i = matches.sql.length - 1; i>=0; --i){ 
      if (matches.sql[i].test(reqObj.url)) {
         reqObj.attack = 'true';
         reqObj.attackType = 'SQL';
         break;
      }
   }
   for (var i = matches.dt.length - 1; i>=0; --i){
      if (matches.dt[i].test(reqObj.url)) {
         reqObj.attack = 'true';
         reqObj.attackType = 'Directory Traversal';
         break;
      }
   }
   db.requestWriter(reqObj);
}

exports.check = check;
