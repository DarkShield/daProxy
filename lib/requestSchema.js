var mongoose = require('mongoose');

var reqSchema = mongoose.Schema({
    requestedtimestamp: {type: Date, default: Date.now},
    method: String,
    headers: Object,
    url: String,
    body: String,
    remoteIP: String,
    remotePort: String,
    attack: String,
    attacks: Array
});



/*module.exports = (function (){

    var model = mongoose.model('Request', reqSchema);
    console.log('log5.5 - request model');
    model.disconnect = function(){
        mongoose.disconnect();
    };

    return model;

})();*/

module.exports = mongoose.model('Request', reqSchema);
