var http = require('../http');

exports.check = function (req) {
    var headers = req.headers;

    //If we get a POST from another site, CSRF
    console.log(req);
    //console.log(req.method);
    if (req.method == "POST" && headers.referer && !(headers.referer.indexOf(headers.host + '/') > 0)) {
        http.handle('CSRF', req);
        console.log('HERE!');
    }
    else {
        console.log('no here');
    }
    return {};
};