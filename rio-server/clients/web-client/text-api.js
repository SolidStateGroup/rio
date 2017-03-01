var Router = require('express');
var handleText = require('../../inputs/text-input');

module.exports = function () {
    var api = Router();

    api.post('/', function (req, res) {
        if (!req.body.text) {
            res.status(400);
            res.send('Send some "text" in a JSON object');
            return;
        }
        handleText(req.body.text);
        res.send('Sent your text to the wall!');
    });

    return api;
};
