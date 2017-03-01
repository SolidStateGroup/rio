var Router = require('express');
var slackClient = require('../../clients/slack-client');

module.exports = function () {
    var api = Router();

    api.get('/', function (req, res) {
        res.send("Your image has been posted");
        slackClient.sendSlackMessage(req.query.text);
    });

    return api;
};
