/**
 * Created by kylejohnson on 09/10/2016.
 */
const data = require('../lib/_data');
const { RTMClient } = require('@slack/client');
const _ = require('lodash');
const config = require('../config')
const rtm = new RTMClient(config.slackToken, { logLevel: 'error' });
var channel = null;
const handleImageUrl = require('../inputs/image-url-input');
const handleGIFUrl = require('../inputs/gif-url-input');
const handleVideoUrl = require('../inputs/video-url-input');

var SlackClient = function () {
    var self = this;
    this.init = function () {
        if (!config.slackToken) return;

        rtm.on('error', err => console.log('Slack failed to initialise', err));

        const promise = Promise.all([
            data.post('https://slack.com/api/channels.list?token=' + config.slackToken + '&exclude_archived=1')
                .then(function (res) {
                    return _.find(res.channels, { name: config.slackChannelName });
                }),
            new Promise(resolve => {
                rtm.on('authenticated', () => {
                    console.log('Authenticated with Slack successfully');
                    resolve();
                });
            }),
            new Promise(resolve => {
                rtm.on('ready', function () {
                    console.log('Slack is ready')
                    resolve();
                });
            }),
        ]).then((items) => {
            channel = items[0].id;
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
                    if (imageUrl.toLowerCase().indexOf('.gif') !== -1) {
                        handleGIFUrl(imageUrl);
                    } else {
                        handleImageUrl(imageUrl);
                    }
                } else if (videoUrl) {
                    handleVideoUrl(videoUrl);
                }
            });
            this.sendSlackMessage('PixelWall Server Activated');
        }).catch(err => {
            console.log('Slack failed to initialise', err);
        });

        console.log('Initialising Slack integration');
        rtm.start();

        return promise;
    };

    this.sendSlackMessage = function (message) {
        rtm.sendMessage(message, channel)
            .catch(e => console.error('Failed to send slack message', e));
    };
};

//Keep me alive plz
var http = require("http");
setInterval(function() {
    http.get("http://pixelwall.herokuapp.com/");
}, 300000); // every 5 minutes (300000)



module.exports = new SlackClient();
