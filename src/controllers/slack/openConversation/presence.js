var {RTMClient} = require('@slack/rtm-api');

const token = process.env.SLACK_TOKEN;
var rtm = new RTMClient(token);
//
// rtm.on(RTM_EVENTS.PRESENCE_CHANGE, function (event) {
//     console.log(event.user + ': ' + event.presence);
// });
//
// rtm.connect();

// rtm.on('presence_change', (event) => {
//     console.log(event)
// })
//
// (async () => {
//     // Connect to Slack
//     const { self, team } = await rtm.connect({batch_presence_aware:1});
// })();



// Presence subscription state, and helper
const trackedUserIds = [];
async function addPresenceSubscriptions(userIds) {
    await rtm.subscribePresence(trackedUserIds.concat(userIds));
    trackedUserIds.push(...userIds);
}

// Given: a channel ID where users' presence is subscribed
const trackedChannelId = 'C123456';




// For those user's whose presence was subscribed, log the updates to the console.
rtm.on('presence_change', (event) => {
    console.log(`User: ${event.user} Presence: ${event.presence}`);
});

(async () => {
    await rtm.start();

    // Add the subscription
    try {
        // await addPresenceSubscriptions("U0123TBFC8M");
        console.log('Subscribed to presence for an additional user');
    } catch (error) {
        console.log('Failed to subscribe to presence, error: ', error);
    }
})();