const isQuestion = require('./questionFinder');
const webClient = require('../../../slack/web-api-client');// This argument can be a channel ID, a DM ID, a MPDM ID, or a group ID

const userMap = new Map();

// This argument can be a channel ID, a DM ID, a MPDM ID, or a group ID

async function getPublicChannels(userIds, meetingUrl) {
// (async () => {
    // See: https://api.slack.com/methods/chat.postMessage
    const res = await webClient.conversations.list({});
    const channelIdList = [];
    for (const channel of res.channels) {
        channelIdList.push(channel.id);
    }
    return channelIdList;
}

// })();

function doProcess(message, userIdList, userMap) {
    if (!message.reply_count && message.reply_count > 1) {
        return;
    }

    // sender
    const senderId = message.user;
    if (userIdList.includes(message.user)) {
        if (!userMap.get(senderId)) {
            userMap.set(senderId, {});
        }
        let valueObj = userMap.get(senderId);
        if (!Array.isArray(valueObj.sent)) {
            valueObj.sent = [];
        }
        valueObj.receive.push({
            text: message.text,
        })
        //receiver
        let elements = message.blocks.elements;

        for (let element of elements) {
            if (element.type === 'user') {
                let userId = element.user_id;
                if (userIdList.includes(userId)) {
                    if (!userMap.get(userId)) {
                        userMap.set(userId, {});
                    }
                    let valueObj = userMap.get(userId);
                    if (!Array.isArray(valueObj.receive)) {
                        valueObj.receive = [];
                    }
                    valueObj.receive.push({
                        text: message.text,
                        fromUser: senderId
                    })
                }
            }
        }
    }


}

async function find(channelId, userIdList) {
    const response = await webClient.conversations.history({
        channel: channelId
    });

    for (let message of response.messages) {
        let isQuestion = isQuestion(message.text);
        if (isQuestion) {
            let element = doProcess(message, userIdList, userMap);
        }
    }
}

async function findOpenConversations() {
    const userIdList = [];
    let channelList = await getPublicChannels();
    for(const channelId of channelList) {
        await find(channelId, userIdList);
    }
    console.log(userMap);
}


exports.getPublicChannels = getPublicChannels;
exports.findOpenConversations = findOpenConversations;