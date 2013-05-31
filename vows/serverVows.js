var express = require('express'),
    domainRoutes = require('../app/routes/domainRoutes'),
    vows = require('vows'),
    request = require('request'),
    assert = require('assert'),
    app = express();

app.use(express.bodyParser());
app.get('/domains', function(req, res){
   domainRoutes.getDomains(req, res);
});
app.post('/domains/info', function(req, res){
   //console.log(req.body);
   //res.send('hey yo');
   domainRoutes.drillDown(req, res);
});
app.post('/domains/attacks', function(req,res){
   domainRoutes.getAttacks(req,res);
});
app.listen(1337);

vows.describe('Domain Route').addBatch({
      'localhost/domains': respondsWith(200),
      'response contains uniques':{
         topic: function(){
            request({
               method: 'GET',
               uri: 'http://localhost/domains',
               proxy: 'http://localhost:1337',
               followRedirect: false
            }, this.callback);
         },
         'has a response body that is a String': function(e, res, body){
            assert.isString(body);
            //console.log(body);
         }
      },
      'localhost/domains/info':{
         topic: function(){
            request({
               method: 'POST',
               uri: 'http://localhost/domains/info',
               proxy: 'http://localhost:1337',
               headers: {'Content-Type': 'application/json'},
               body: JSON.stringify({"name": "supercroppers.com"}),
               followRedirect: false
            }, this.callback);
         },
         'responds with a 200': function(e, res, body){
            assert.equal(200, res.statusCode);
         },
         'has a response body that is an object': function(e, res, body){
            console.log(body);
            assert.isString(body);
         }
      },
      'localhost/domains/attacks':{
         topic: function(){
            request({
               method: 'POST',
               uri: 'http://localhost/domains/attacks',
               proxy: 'http://localhost:1337',
               headers: {'Content-Type': 'application/json'},
               body: JSON.stringify({"name": "www.urbanhydro.com"}),
               followRedirect: false
            }, this.callback);
         },
         'responds with a 200': function(e, res, body){
            assert.equal(200, res.statusCode);
         },
         'has a response body that is an object': function(e, res, body){
            console.log(body);
            assert.isString(body);
         }
      }
   }).export(module);
function respondsWith(code){
   var context = {
      topic: function(){
         var url = this.context.name;
         request({
            method: 'GET',
            uri: 'http://'+url,
            followRedirect: false,
            proxy: 'http://localhost:1337'
            }, this.callback);    
      }
   };
      context['we get a ' + code + ' response code'] = assertStatus(code);
      return context;
 }

function assertStatus(code){
   return function(res){
      assert.equal(res.statusCode, code);
     };
}      
