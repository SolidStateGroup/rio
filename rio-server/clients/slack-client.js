/**
 * Created by kylejohnson on 09/10/2016.
 */
var data = require('../lib/_data');
var CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
var RtmClient = require('@slack/client').RtmClient;
var _ = require('lodash');
var token = require('../config').slackToken;
var rtm = new RtmClient(token, { logLevel: 'error' });
var channel = null;
var rtmStart = null;
var handleImageUrl = require('../inputs/gif-url-input');
var handleVideoUrl = require('../inputs/video-url-input');

var SlackClient = function () {
    var self = this;
    this.init = function () {
        rtm.start();

        return Promise.all([
            data.post('https://slack.com/api/channels.list?token=' + token + '&exclude_archived=1')
                .then(function (res) {
                    return _.find(res.channels, { name: 'pixelwall' });
                }),
            new Promise(function (resolve) {
                rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, function (rtmStartData) {
                    resolve(rtmStartData)
                });
            }),
            new Promise(function (resolve) {
                rtm.on('open', function () {
                    resolve()
                });
            })
        ]).then(function (items) {
            channel = items[0].id;
            rtmStart = items[1];
            rtm.on('message', function (message) {
              // @TODO video slack support
                var imageUrl, videoUrl;
                if (message.channel == channel) {
                    if (message.attachments) {
                        videoUrl = message.attachments[0].service_name == 'YouTube' ? message.attachments[0].from_url : null;
                        imageUrl = message.attachments[0].image_url;
                    } else if (message.message && message.message.attachments) {
                        videoUrl = message.message.attachments[0].service_name == 'YouTube' ? message.message.attachments[0].from_url : null;
                        imageUrl = message.message.attachments[0].image_url;
                    } else {
                        data.get('http://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=' + encodeURIComponent(message.text))
                            .then(function (res) {
                                if (res.data && res.data.url) {
                                    imageUrl = res.data.url;
                                    self.sendSlackMessage(imageUrl);
                                }
                            })
                    }
                }
                if (imageUrl) {
                    handleImageUrl(imageUrl);
                } else if (videoUrl) {
                    handleVideoUrl(videoUrl);
                }
            });
            this.sendSlackMessage('PixelWall Server Activated');
        }.bind(this));
    };

    this.sendSlackMessage = function (message) {
        rtm.sendMessage(message, channel);
    };
};

//Keep me alive plz
var http = require("http");
setInterval(function() {
    http.get("http://pixelwall.herokuapp.com/");
}, 300000); // every 5 minutes (300000)



module.exports = new SlackClient();
