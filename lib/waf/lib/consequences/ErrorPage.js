exports.run = function (req, res) {
    res.writeHead(302, {
        'Location': 'http://' + req.header.host +'/error.html'
    });
    res.end();
};