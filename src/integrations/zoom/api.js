// An access token (from your Slack app or custom integration - xoxp, xoxb)
// const web = require('src/slack/web-api-client');
const web = require('../../../src/slack/web-api-client');
// This argument can be a channel ID, a DM ID, a MPDM ID, or a group ID

async function sendMessage(userIds, meetingUrl) {
    const channelId = await getDirectDM(userIds, meetingUrl)

    // See: https://api.slack.com/methods/chat.postMessage
    await web.chat.postMessage({
        channel: channelId,
        text: 'Join the call to talk to your buddies: ' + meetingUrl
    });
    // `res` contains information about the posted message
    console.log('hello!! '+channelId);
}

async function getDirectDM(userIds, meetingUrl) {
    let userIdText = ''
    if(Array.isArray(userIds)) {
        userIdText = userIds.join(',')
    } else {
        userIdText = userIds;
    }

    // See: https://api.slack.com/methods/chat.postMessage
    const response = await web.conversations.open({
        users: userIdText,
        text: 'Join the call to talk to you buddy: ' + meetingUrl
    });
    return response.channel.id;
}


module.exports = sendMessage;