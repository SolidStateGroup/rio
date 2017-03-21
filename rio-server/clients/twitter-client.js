const Twit = require('twit');
const textInput = require('../inputs/text-input');
const config = require('../config');

module.exports = {
    init: () => {
        if (config.twitter.consumer_key) {
            var T = new Twit(config.twitter)
            var stream = T.stream('statuses/filter', { track: '#rio' })
            stream.on('tweet', function (tweet) {
                textInput(`${tweet.user.screen_name}: ${tweet.text}`);
            })
        }
    }
};
