const {
    listen,
    fire
} = require('src/util/bus');
const dataFeeds = require('../controllers/slack/command/dataFeeds');
const web = require('../slack/web-api-client'); // This argument can be a channel ID, a DM ID, a MPDM ID, or a group ID
listen('waterBreak', async ({
    id,
    message
}) => {
    await web.chat.postMessage({
        channel: id,
        text: message
    });
});

listen('JiraCreationAlert', async({
    to,
    data
}) => {
    await web.chat.postMessage({
        channel: to,
        text: data.message
    });
});

listen('OutlookMeetingAlert', async({
    to,
    data
}) => {
    await web.chat.postMessage({
        channel: to,
        text: data.message
    });
});

listen('PlannerAlert', ({
    to,
    data
}) => {
    const {
        message
    } = data;

    switch (message.type) {
        case 'food':
            dataFeeds.getRedditRecipes(null, async (url) => {
                await web.chat.postMessage({
                    channel: to,
                    // text: `Its time for ${message.name}! \n ${url}`,
                    blocks: [
                        {
                            "type": "section",
                            "text": {
                                "type": "plain_text",
                                "text": `Its time for ${message.name}! \n ${url}`,
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
                                        "text": "Snooze for 15 mins",
                                        "emoji": false
                                    },

                                }
                            ]
                        }
                    ]
                });
            });
        case 'casual':
            dataFeeds.getStretches(null, async (url) => {
                await web.chat.postMessage({
                    channel: to,
                    text: `Its time for ${message.name}! \n ${url}`,
                });
            });
        case 'fitness':
            dataFeeds.getWorkout(null, async (url) => {
                await web.chat.postMessage({
                    channel: to,
                    text: `Its time for ${message.name}! \n ${url}`,
                });
            });
            break;
        case 'news':
            dataFeeds.getWorkout("javascript", async (url) => {
                await web.chat.postMessage({
                    channel: to,
                    text: `Its time for ${message.name}! \n ${url}`,
                });
            });
            break;
        case 'music':
            dataFeeds.getSongSuggestion(null, async (url) => {
                await web.chat.postMessage({
                    channel: to,
                    text: `Its time for ${message.name}! \n ${url}`,
                });
            });
            break;
        default:
            break;
    }

});
