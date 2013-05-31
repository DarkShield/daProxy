exports.handle = function (attack, req) {
    //var headers = req.headers;

    console.log('Attack detected! Type: ' + attack + ' IP: ' + req.connection.remoteAddress);
    /*function kill(consequence){
        attack = require('./inspectors/' + consequence);
        attack.run(req, res);
        //callback();
    }*/
};