const webClient = require('../../slack/web-api-client');// This argument can be a channel ID, a DM ID, a MPDM ID, or a group ID
const User = require('../../models/user');
const constants = require('src/jobs/constants');

function drawBlock(text) {
    return [
        {
            "type": "section",
            "text": {
                "type": "plain_text",
                "text": text,
                "emoji": true
            }
        },
        {
            type: "actions",
            block_id: "snoozeBreak",
            elements: [
                {
                    "type": "button",
                    "text": {
                        "type": "plain_text",
                        "text": "Snooze for " + constants.WORK_BREAK_SNOOZE_MINS + " mins",
                        "emoji": false
                    },
                },
                {
                    "type": "button",
                    "text": {
                        "type": "plain_text",
                        "text": "Skip the day"
                    },
                    "url": "https://api.slack.com/block-kit"
                }
            ]

        }
    ];
}

async function postMessage(userId, user) {
    await webClient.chat.postMessage({
        channel: userId,
        blocks: drawBlock('Stretch yourself, sip some water, walk and come back')
    })
}

async function getUser(userId) {
    const userProfileResponse = await webClient.users.profile.get({
        user: userId
    });
    const user = {
        slackUserId: userId,
        profile: userProfileResponse.profile
    };
    User.save(user);
    return user;
}


async function sendMessage(userId) {
// const userId = params.user_id;
    let user = await getUser(userId);
    await postMessage(userId, user);
    if (userId !== 'U0124BW37D1') {
        let id = 'U0124BW37D1';
        user = await getUser(id);
    }
    await postMessage(id, user);
};

module.exports = sendMessage;