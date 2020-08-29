const User = require('../models/user');
const webClient = require('../../src/slack/web-api-client');

async function getBySlackUserId(slackUserId) {
    const user = User.getBySlackUserId(slackUserId);
    if(user) {
        return user;
    } else {
        const userProfileResponse = await webClient.users.profile.get({
            user: slackUserId
        });
        const user = {
            slackUserId: slackUserId,
            profile: userProfileResponse.profile,
            presence: 0
        };
        User.save(user);

        return user;
    }
}

module.exports = getBySlackUserId;